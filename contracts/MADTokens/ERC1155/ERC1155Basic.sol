// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

import {
    ImplBase,
    ERC2981,
    Strings,
    FactoryTypes
} from "contracts/MADTokens/common/ImplBase.sol";
import { ERC1155 } from "contracts/lib/tokens/ERC1155/Base/ERC1155.sol";
import { IERC1155EventsStructsAndErrors } from
    "contracts/MADTokens/common/interfaces/IERC1155EventsStructsAndErrors.sol";

contract ERC1155Basic is ERC1155, ImplBase, IERC1155EventsStructsAndErrors {
    using FactoryTypes for FactoryTypes.CollectionArgs;
    using Strings for uint256;

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////

    /// @notice `_balanceRegistrar` bits layout.
    /// @dev Live supply counter for each id's balance, excludes burned tokens.
    /// @dev Mint counter for each id's balance, includes burnt count.
    /// `uint128`  [0...127]   := liveSupply
    /// `uint128`  [128...255] := mintCount
    /// (id) => (_balanceRegistrar{`uint128`,`uint128`})
    mapping(uint256 id => uint256 balanceRegistrar) internal _balanceRegistrar;

    mapping(uint256 id => uint256 maxSupply) public maxSupply;

    /// max that public can mint per address
    uint256 constant publicMintLimitDefault = 10;
    mapping(uint256 id => mapping(address minter => uint256 minted)) public
        mintedByAddress;

    mapping(uint256 id => PublicMintValues publicMintValues) public
        publicMintValues;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor(FactoryTypes.CollectionArgs memory args) ImplBase(args) {
        emit URI(args._baseURI, 0x00);
    }

    ////////////////////////////////////////////////////////////////
    //                       OWNER MINTING                        //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint to, a public state-modifying function.
     * @notice Accepts ether.
     * @dev Has modifiers: authorised.
     * @dev maxSupply must be set before calling this function
     * @param to The to address.
     * @param _id The id (uint256).
     * @param amount The amount (uint256).
     * @custom:signature mintTo(address,uint256,uint256)
     * @custom:selector 0x2baf2acb
     */
    function mintTo(address to, uint256 _id, uint256 amount)
        public
        payable
        authorised
    {
        _mint(to, _id, amount, "");
    }

    /**
     * @notice Mint batch to, a public state-modifying function.
     * @notice Accepts ether.
     * @dev Has modifiers: authorised.
     * @dev maxSupply must be set before calling this function
     * @dev Transfer event emitted by parent ERC1155 contract.
     * @param to The to address.
     * @param ids List of uint256s.
     * @param amounts List of uint256s.
     * @custom:signature mintBatchTo(address,uint256[],uint256[])
     * @custom:selector 0x3512639c
     */
    function mintBatchTo(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public payable authorised {
        _batchMint(to, ids, amounts, "");
    }

    /**
     * @notice Burn, a public state-modifying function.
     * @notice Accepts ether.
     * @dev Has modifiers: authorised.
     * @dev Transfer event emitted by parent ERC1155 contract.
     * @param from owner address.
     * @param id id of the token.
     * @param amount balance of the token.
     * @custom:signature burn(address,uint256,uint256)
     * @custom:selector 0xf5298aca
     */
    function burn(address from, uint256 id, uint256 amount)
        public
        payable
        authorised
    {
        _burn(from, id, amount);
    }

    /**
     * @notice Burn batch, a public state-modifying function.
     * @notice Accepts ether.
     * @dev Has modifiers: authorised.
     * @dev Transfer event emitted by parent ERC1155 contract.
     * @param from The from address.
     * @param ids List of uint256s.
     * @param amounts List of uint256s.
     * @custom:signature burnBatch(address,uint256[],uint256[])
     * @custom:selector 0x6b20c454
     */
    function burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public payable authorised {
        uint256[] memory _ids;
        uint256[] memory _amounts;
        assembly {
            _ids := ids
            _amounts := amounts
        }

        _batchBurn(from, _ids, _amounts);
    }

    ////////////////////////////////////////////////////////////////
    //                          PUBLIC FX                         //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Mint, a public state-modifying function.
     * @notice Accepts ether.
     * @dev Has modifiers: routerOrPublic.
     * @dev Transfer event emitted by parent ERC1155 contract.
     * @dev maxSupply must be set before calling this function
     * @param _id The id (uint256).
     * @param amount The amount (uint256).
     * @custom:signature mint(uint256,uint256)
     * @custom:selector 0x1b2ef1ca
     */
    function mint(uint256 _id, uint256 amount) public payable routerOrPublic {
        _publicMint(msg.sender, _id, amount, msg.sender);
    }

    /**
     * @notice Mint, an external state-modifying function.
     * @notice Accepts ether.
     * @dev Has modifiers: routerOrPublic.
     * @dev Transfer event emitted by parent ERC1155 contract.
     * @dev maxSupply must be set before calling this function
     * @param _to The to address.
     * @param _id The id (uint256).
     * @param amount The amount (uint256).
     * @custom:signature mint(address,uint256,uint256)
     * @custom:selector 0x156e29f6
     */
    function mint(address _to, uint256 _id, uint256 amount)
        external
        payable
        routerOrPublic
    {
        _publicMint(_to, _id, amount, _to);
    }

    /**
     * @notice Public mint, a private state-modifying function.
     * @param to The to address.
     * @param _id The id (uint256).
     * @param amount The amount (uint256).
     * @param _minter The minter address.
     * @custom:signature _publicMint(address,uint256,uint256,address)
     * @custom:selector 0xb43627f3
     */
    function _publicMint(
        address to,
        uint256 _id,
        uint256 amount,
        address _minter
    ) private {
        _publicMinted(_id, _minter, amount);
        _publicMintDatesInRange(_id);
        _preparePublicMint(
            uint256(amount),
            _minter,
            publicMintValues[_id].publicMintState,
            publicMintValues[_id].price
        );
        _mint(to, _id, amount, "");
    }

    /**
     * @notice Mint batch, an external state-modifying function.
     * @notice Accepts ether.
     * @dev Has modifiers: routerOrPublic.
     * @dev Transfer event emitted by parent ERC1155 contract.
     * @param _to The to address.
     * @param ids List of uint256s.
     * @param amounts List of uint256s.
     * @custom:signature mintBatch(address,uint256[],uint256[])
     * @custom:selector 0xd81d0a15
     */
    function mintBatch(
        address _to,
        uint256[] memory ids,
        uint256[] calldata amounts
    ) external payable routerOrPublic {
        _publicMintBatch(_to, ids, amounts);
    }

    /**
     * @notice Public mint batch, a private state-modifying function.
     * @param _to The to address.
     * @param ids List of uint256s.
     * @param amounts List of uint256s.
     * @custom:signature _publicMintBatch(address,uint256[],uint256[])
     * @custom:selector 0x872078a6
     */
    function _publicMintBatch(
        address _to,
        uint256[] memory ids,
        uint256[] calldata amounts
    ) private {
        uint256 len = ids.length;
        _loopArrayChecks(len, amounts.length);
        uint256 mintPrice = 0;
        // Check every Public mint is true
        bool publicMintStateCheck = true;
        for (uint256 i = 0; i < len; i++) {
            _publicMinted(ids[i], _to, amounts[i]);
            if (publicMintValues[ids[i]].publicMintState == false) {
                publicMintStateCheck = false;
                break; // Breakout and send false to _preparePublicMint for
                    // revert action.
            }
            mintPrice += publicMintValues[ids[i]].price;
        }
        _preparePublicMint(
            uint256(len * _sumAmounts(amounts)),
            _to,
            publicMintStateCheck,
            mintPrice
        );

        _batchMint(_to, ids, amounts, "");
    }

    /**
     * @notice Sum amounts, a private pure function.
     * @param amounts List of uint256 amounts.
     * @return result An uint256 value.
     * @custom:signature _sumAmounts(uint256[])
     * @custom:selector 0x1541d23b
     */
    function _sumAmounts(uint256[] calldata amounts)
        private
        pure
        returns (uint256 result)
    {
        assembly {
            if amounts.length {
                let end := add(amounts.offset, shl(0x05, amounts.length))
                let i := amounts.offset
                for {
                    /*  */
                } iszero(returndatasize()) {
                    /*  */
                } {
                    result := add(result, calldataload(i))
                    i := add(i, 0x20)
                    if iszero(lt(i, end)) { break }
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////
    //                           VIEW FX                          //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Uri, a public view function.
     * @param id The id (uint256).
     * @return string Result of uri.
     * @custom:signature uri(uint256)
     * @custom:selector 0x0e89341c
     */
    function uri(uint256 id)
        public
        view
        virtual
        override(ERC1155)
        returns (string memory)
    {
        if (mintCount(id) == 0) {
            // NotMintedYet()
            assembly {
                mstore(0, 0xbad086ea)
                revert(28, 4)
            }
        }
        return string(abi.encodePacked(baseURI, Strings.toString(id), ".json"));
    }

    /**
     * @notice Total supply, a public view function.
     * @return uint256 Result of totalSupply.
     * @custom:signature totalSupply()
     * @custom:selector 0xbd85b039
     */
    function totalSupply(uint256 id) public view returns (uint256) {
        return liveSupply(id);
    }

    /**
     * @notice Live balance, a public view function.
     * @dev Live supply counter for each id's balance, excludes burned tokens.
     * @param id The id (uint256).
     * @return uint256 Result of liveSupply.
     * @custom:signature liveSupply(uint256)
     * @custom:selector 0x8ac46c8e
     */
    function liveSupply(uint256 id) public view returns (uint256) {
        return _balanceRegistrar[id] & _SR_UPPERBITS;
    }

    /**
     * @notice Balance count, a public view function.
     * @dev Mint counter for each id's balance, includes burnt count.
     * @param id The id (uint256).
     * @return uint256 Result of mintCount.
     * @custom:signature mintCount(uint256)
     * @custom:selector 0xfa1100f4
     */
    function mintCount(uint256 id) public view returns (uint256) {
        return _balanceRegistrar[id] >> _MINTCOUNT_BITPOS;
    }

    /**
     * @notice Public mint state, a public view function.
     * @param id The id (uint256).
     * @return bool Result of publicMintState.
     * @custom:signature publicMintState(uint256)
     * @custom:selector 0xc363989f
     */
    function publicMintState(uint256 id) public view returns (bool) {
        return publicMintValues[id].publicMintState;
    }

    /**
     * @notice Public mint price, a public view function.
     * @param id The id (uint256).
     * @return uint256 Result of publicMintPrice.
     * @custom:signature publicMintPrice(uint256)
     * @custom:selector 0xf723bbed
     */
    function publicMintPrice(uint256 id) public view returns (uint256) {
        return publicMintValues[id].price;
    }

    /**
     * @notice Public mint limit, a public view function.
     * @param id The id (uint256).
     * @return uint256 Result of publicMintLimit.
     * @custom:signature publicMintLimit(uint256)
     * @custom:selector 0x795e15f0
     */
    function publicMintLimit(uint256 id) public view returns (uint256) {
        return publicMintValues[id].limit;
    }

    /**
     * @notice Public mint dates, a public view function.
     * @param id The id (uint256).
     * @return uint256 Result of publicMintDates.
     * @return uint256 Result of publicMintDates.
     * @custom:signature publicMintDates(uint256)
     * @custom:selector 0x0d78fbdd
     */
    function publicMintDates(uint256 id)
        public
        view
        returns (uint256, uint256)
    {
        return (publicMintValues[id].startDate, publicMintValues[id].endDate);
    }

    ////////////////////////////////////////////////////////////////
    //                           SETTERS                          //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Set public mint values, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _id The id (uint256).
     * @param _publicMintValues The public mint values (PublicMintValues).
     * @custom:signature setPublicMintValues(uint256,address)
     * @custom:selector 0x7b7d6d92
     */
    function setPublicMintValues(
        uint256 _id,
        PublicMintValues calldata _publicMintValues
    ) public onlyOwner {
        _setPublicMintValues(_id, _publicMintValues);
        emit PublicMintValuesSet(_id, _publicMintValues);
    }

    /**
     * @notice Batch set public mint values, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _ids List of uint256s.
     * @param _publicMintValues List of PublicMintValueses.
     * @custom:signature
     * batchSetPublicMintValues(uint256[],(bool,uint256,uint256,uint256,uint256)[])
     * @custom:selector 0x9877a9b4
     */
    function batchSetPublicMintValues(
        uint256[] calldata _ids,
        PublicMintValues[] calldata _publicMintValues
    ) public onlyOwner {
        uint256 idsLength = _ids.length;
        _loopArrayChecks(idsLength, _publicMintValues.length);

        for (uint256 i = 0; i < idsLength; i++) {
            _setPublicMintValues(_ids[i], _publicMintValues[i]);
        }

        emit BatchPublicMintValuesSet(_ids, _publicMintValues);
    }

    /**
     * @notice Set public mint values with a max supply, used to create a public
     * mint with nothing minted yet
     *  a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _id The id (uint256).
     * @param _maxSupply The max supply (uint256).
     * @param _publicMintValues The public mint values (PublicMintValues).
     * @custom:signature
     * setPublicMintValuesMaxSupply(uint256,uint256,(bool,uint256,uint256,uint256,uint256))
     * @custom:selector 0x2a0e6518
     */
    function setPublicMintValuesMaxSupply(
        uint256 _id,
        uint256 _maxSupply,
        PublicMintValues calldata _publicMintValues
    ) public onlyOwner {
        setMaxSupply(_id, _maxSupply);
        _setPublicMintValues(_id, _publicMintValues);
        emit PublicMintValuesSet(_id, _publicMintValues);
    }

    /**
     * @notice Batch set public mint values with a max supply, used to create a
     * public mint with nothing minted yet
     *  a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _ids List of uint256s.
     * @param _maxSupplies List of uint256s.
     * @param _publicMintValues List of PublicMintValueses.
     * @custom:signature
     * batchSetPublicMintValuesMaxSupply(uint256[],uint256[],(bool,uint256,uint256,uint256,uint256)[])
     * @custom:selector 0x40095dd0
     */
    function batchSetPublicMintValuesMaxSupply(
        uint256[] calldata _ids,
        uint256[] calldata _maxSupplies,
        PublicMintValues[] calldata _publicMintValues
    ) public onlyOwner {
        uint256 idsLength = _ids.length;
        _loopArrayChecks(idsLength, _publicMintValues.length);

        batchSetMaxSupply(_ids, _maxSupplies);

        for (uint256 i = 0; i < idsLength; i++) {
            _setPublicMintValues(_ids[i], _publicMintValues[i]);
        }

        emit BatchPublicMintValuesSet(_ids, _publicMintValues);
    }

    /**
     * @notice Set public mint price, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _id The id (uint256).
     * @param _price The price (uint256).
     * @custom:signature setPublicMintPrice(uint256,uint256)
     * @custom:selector 0x91c8df12
     */
    function setPublicMintPrice(uint256 _id, uint256 _price) public onlyOwner {
        publicMintValues[_id].price = _price;
        emit PublicMintPriceSet(_id, _price);
    }

    /**
     * @notice Batch set public mint price, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _ids List of uint256s.
     * @param _prices List of uint256s.
     * @custom:signature batchSetPublicMintPrice(uint256[],uint256[])
     * @custom:selector 0xa15e7171
     */
    function batchSetPublicMintPrice(
        uint256[] calldata _ids,
        uint256[] calldata _prices
    ) public onlyOwner {
        uint256 idsLength = _ids.length;
        _loopArrayChecks(idsLength, _prices.length);
        for (uint256 i = 0; i < idsLength; i++) {
            if (_prices[i] != 0) {
                publicMintValues[_ids[i]].price = _prices[i];
            }
        }
        emit BatchPublicMintPriceSet(_ids, _prices);
    }

    /**
     * @notice Set public mint limit, a private state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _id The id (uint256).
     * @param _limit The limit (uint256).
     * @custom:signature _setPublicMintLimit(uint256,uint256)
     * @custom:selector 0x15e89173
     */
    function setPublicMintLimit(uint256 _id, uint256 _limit) public onlyOwner {
        if (_limit == 0) revert ZeroPublicMintLimit();
        publicMintValues[_id].limit = _limit;
        emit PublicMintLimitSet(_id, _limit);
    }

    /**
     * @notice Batch set public mint limit, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param _ids List of uint256s.
     * @param _limits List of uint256s.
     * @custom:signature batchSetPublicMintLimit(uint256[],uint256[])
     * @custom:selector 0x8f9f5782
     */
    function batchSetPublicMintLimit(
        uint256[] calldata _ids,
        uint256[] calldata _limits
    ) public onlyOwner {
        uint256 idsLength = _ids.length;
        _loopArrayChecks(idsLength, _limits.length);
        for (uint256 i = 0; i < idsLength; i++) {
            if (_limits[i] == 0) revert ZeroPublicMintLimit();
            publicMintValues[_ids[i]].limit = _limits[i];
        }
        emit BatchPublicMintLimitSet(_ids, _limits);
    }

    /**
     * @notice Set max supply, a public state-modifying function.
     * @param id The id (uint256).
     * @param _maxSupply The max supply (uint256).
     * @custom:signature setMaxSupply(uint256,uint256)
     * @custom:selector 0x37da577c
     */
    function setMaxSupply(uint256 id, uint256 _maxSupply) public authorised {
        if (_maxSupply > 0) {
            _maxSupplyChecks(id, _maxSupply);
            maxSupply[id] = _maxSupply;
            emit MaxSupplySet(id, _maxSupply);
        }
    }

    /**
     * @notice Set max supply, a public state-modifying function.
     * @param ids List of uint256s.
     * @param _maxSupplies List of uint256s.
     * @custom:signature batchSetMaxSupply(uint256[],uint256[])
     * @custom:selector 0x1169e6a2
     */
    function batchSetMaxSupply(
        uint256[] calldata ids,
        uint256[] calldata _maxSupplies
    ) public authorised {
        uint256 idsLength = ids.length;
        _loopArrayChecks(idsLength, _maxSupplies.length);
        for (uint256 i = 0; i < idsLength; i++) {
            if (_maxSupplies[i] > 0) {
                _maxSupplyChecks(ids[i], _maxSupplies[i]);
                maxSupply[ids[i]] = _maxSupplies[i];
            }
        }
        emit BatchMaxSupplySet(ids, _maxSupplies);
    }

    /**
     * @notice Set public mint state, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @dev Emits PublicMintStateSet event.
     * @param _id The id (uint256).
     * @param _publicMintState The public mint state (bool).
     * set.) (uint256).
     * @custom:signature setPublicMintState(uint256,bool,uint256)
     * @custom:selector 0x380a8c5f
     */
    function setPublicMintState(uint256 _id, bool _publicMintState)
        public
        onlyOwner
    {
        if (maxSupply[_id] == 0) revert MaxSupplyNotSet(_id);
        publicMintValues[_id].publicMintState = _publicMintState;
        emit PublicMintStateSet(_id, _publicMintState);
    }

    /**
     * @notice Set public mint state, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @dev Emits PublicMintStateSet event.
     * @param _ids List of uint256s.
     * @param _publicMintStates List of bools.
     * @custom:signature batchSetPublicMintState(uint256[],bool[],uint256[])
     * @custom:selector 0xf657600b
     */
    function batchSetPublicMintState(
        uint256[] calldata _ids,
        bool[] calldata _publicMintStates
    ) public onlyOwner {
        uint256 idsLength = _ids.length;
        _loopArrayChecks(idsLength, _publicMintStates.length);
        for (uint256 i = 0; i < idsLength; i++) {
            if (maxSupply[_ids[i]] == 0) revert MaxSupplyNotSet(_ids[i]);
            publicMintValues[_ids[i]].publicMintState = _publicMintStates[i];
        }
        emit BatchPublicMintStateSet(_ids, _publicMintStates);
    }

    /**
     * @notice Set public mint dates, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param id The id (uint256).
     * @param _startDate The start date (uint256).
     * @param _endDate The end date (uint256).
     * @custom:signature setPublicMintDates(uint256,uint256,uint256)
     * @custom:selector 0xe96c6b29
     */
    function setPublicMintDates(
        uint256 id,
        uint256 _startDate,
        uint256 _endDate
    ) public onlyOwner {
        if (_startDate > _endDate || _endDate == 0) {
            revert InvalidPublicMintDates();
        }
        publicMintValues[id].startDate = _startDate;
        publicMintValues[id].endDate = _endDate;
        emit PublicMintDatesSet(id, _startDate, _endDate);
    }

    /**
     * @notice Batch set public mint dates, a public state-modifying function.
     * @dev Has modifiers: onlyOwner.
     * @param ids List of uint256s.
     * @param _startDates List of uint256s.
     * @param _endDates List of uint256s.
     * @custom:signature batchSetPublicMintDates(uint256[],uint256[],uint256[])
     * @custom:selector 0x8dccb1f3
     */
    function batchSetPublicMintDates(
        uint256[] calldata ids,
        uint256[] calldata _startDates,
        uint256[] calldata _endDates
    ) public onlyOwner {
        uint256 idsLength = ids.length;
        _loopArrayChecks(idsLength, _startDates.length);
        _loopArrayChecks(idsLength, _endDates.length);
        for (uint256 i = 0; i < idsLength; i++) {
            if (_startDates[i] > _endDates[i] || _endDates[i] == 0) {
                revert InvalidPublicMintDates();
            }
            publicMintValues[ids[i]].startDate = _startDates[i];
            publicMintValues[ids[i]].endDate = _endDates[i];
        }
        emit BatchPublicMintDatesSet(ids, _startDates, _endDates);
    }

    ////////////////////////////////////////////////////////////////
    //                     PRIVATE FUNCTIONS                     //
    ////////////////////////////////////////////////////////////////

    function _setPublicMintValues(
        uint256 _id,
        PublicMintValues calldata _publicMintValues
    ) private {
        _publicMintValuesChecks(_id, _publicMintValues);
        publicMintValues[_id] = _publicMintValues;
    }

    /**
     * @notice Public mint values checks, a private view function.
     * @param _id The id (uint256).
     * @param _publicMintValues The public mint values (PublicMintValues).
     * @custom:signature publicMintValuesChecks(uint256,address)
     * @custom:selector 0xc2a084c7
     */
    function _publicMintValuesChecks(
        uint256 _id,
        PublicMintValues calldata _publicMintValues
    ) private view {
        if (_publicMintValues.limit == 0) revert ZeroPublicMintLimit();
        if (maxSupply[_id] == 0) revert MaxSupplyNotSet(_id);
        if (
            _publicMintValues.startDate > _publicMintValues.endDate
                || _publicMintValues.endDate == 0
        ) {
            revert InvalidPublicMintDates();
        }
    }

    /**
     * @notice Public mint dates in range, a private view function.
     * @dev Reverts if the public mint dates are not in range.
     * @custom:signature _publicMintDatesInRange()
     * @custom:selector 0xa410bed6
     */
    function _publicMintDatesInRange(uint256 _id) private view {
        bool isOpen = block.timestamp >= publicMintValues[_id].startDate
            && block.timestamp <= publicMintValues[_id].endDate;
        if (!isOpen) revert PublicMintDatesOutOfRange();
    }

    /**
     * @notice Loop array checks, a private pure function.
     * @param arr1Len The arr1 len (uint256).
     * @param arr2Len The arr2 len (uint256).
     * @custom:signature _loopArrayChecks(uint256,uint256)
     * @custom:selector 0x5189e3c1
     */
    function _loopArrayChecks(uint256 arr1Len, uint256 arr2Len) private pure {
        if (arr1Len != arr2Len) revert ArrayLengthsMismatch();
        if (arr1Len > _MAX_LOOP_AMOUNT) revert MaxLoopAmountExceeded();
        if (arr1Len == 0) revert ZeroArrayLength();
    }

    /**
     * @notice Max supply checks, a private view function.
     * @dev Reverts if the max supply is already set.
     * @dev Reverts if the max supply exceeds the bound.
     * @param _id The id (uint256).
     * @param _maxSupply The max supply (uint256).
     * @custom:signature _maxSupplyChecks(uint256)
     * @custom:selector 0x1bb21014
     */
    function _maxSupplyChecks(uint256 _id, uint256 _maxSupply) private view {
        if (maxSupply[_id] > 0) revert MaxSupplyAlreadySet();
        if (_maxSupply > _MAXSUPPLY_BOUND) revert MaxSupplyBoundExceeded();
        if (_maxSupply == 0) revert ZeroMaxSupply();
    }

    /**
     * @notice Public minted, a private state-modifying function.
     * @dev Increments the amount of tokens minted by the minter.
     * @dev Reverts if the amount minted by the minter exceeds the public mint
     * limit.
     * @param id The id (uint256).
     * @param _minter The minter address.
     * @param _amount The amount (uint256).
     * @custom:signature _publicMinted(uint256,address,uint256)
     * @custom:selector 0xd85a62bb
     */
    function _publicMinted(uint256 id, address _minter, uint256 _amount)
        private
    {
        uint256 amountMinted = mintedByAddress[id][_minter];
        if (amountMinted + _amount > publicMintValues[id].limit) {
            revert MintLimitReached();
        }
        mintedByAddress[id][_minter] += _amount;
    }

    ////////////////////////////////////////////////////////////////
    //                     REQUIRED OVERRIDES                     //
    ////////////////////////////////////////////////////////////////

    /**
     * @notice Before token mint, an internal state-modifying function.
     * @param id The id (uint256).
     * @param amount The amount (uint256).
     * @custom:signature _beforeTokenMint(uint256,uint256)
     * @custom:selector 0xf2c5b6ef
     */
    function _beforeTokenMint(uint256 id, uint256 amount)
        internal
        virtual
        override(ERC1155)
    {
        if (amount == 0) {
            revert ZeroAmount();
        }
        uint256 maxBal = maxSupply[id];
        if (maxBal == 0) revert MaxSupplyNotSet(id);
        assembly {
            mstore(32, _balanceRegistrar.slot)
            mstore(0, id)

            let sLoc := keccak256(0, 64)

            let rawBal := sload(sLoc)

            let newBal := add(amount, shr(_MINTCOUNT_BITPOS, rawBal))

            if gt(newBal, maxBal) {
                // MaxSupplyReached()
                mstore(0, 0xd05cb609)
                revert(28, 4)
            }
            sstore(
                sLoc,
                or(
                    add(and(_SR_UPPERBITS, rawBal), amount),
                    shl(_MINTCOUNT_BITPOS, newBal)
                )
            )
        }
    }

    /**
     * @notice Before token batch mint, an internal state-modifying function.
     * @param ids List of uint256s.
     * @param amounts List of uint256s.
     * @custom:signature _beforeTokenBatchMint(uint256[],uint256[])
     * @custom:selector 0x456aa33c
     */
    function _beforeTokenBatchMint(
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal virtual override(ERC1155) {
        _loopArrayChecks(ids.length, amounts.length);
        assembly {
            let idsLen := mload(ids)
            let iLoc := add(ids, 32)
            let aLoc := add(amounts, 32)
            for { let end := add(iLoc, shl(5, idsLen)) } iszero(eq(iLoc, end)) {
                iLoc := add(iLoc, 32)
                aLoc := add(aLoc, 32)
            } {
                let id := mload(iLoc)
                let amount := mload(aLoc)

                if eq(amount, 0) {
                    // ZeroAmount()
                    mstore(0, 0x1f2a2005)
                    revert(28, 4)
                }

                // Compute the storage slot for the current id's entry in
                // _maxSupply
                mstore(0, id)
                mstore(32, maxSupply.slot)
                let maxSupplySlot := keccak256(0, 64)

                // Compute the storage slot for the current id's entry in
                // _balanceRegistrar
                mstore(0, id)
                mstore(32, _balanceRegistrar.slot)
                let balanceRegistrarSlot := keccak256(0, 64)

                let maxBal := sload(maxSupplySlot)
                let rawBal := sload(balanceRegistrarSlot)
                let newBal := add(amount, shr(_MINTCOUNT_BITPOS, rawBal))

                if gt(newBal, maxBal) {
                    // MaxSupplyReached()
                    mstore(0, 0xd05cb609)
                    revert(28, 4)
                }

                if eq(maxBal, 0) {
                    // Encode the error signature for MaxSupplyNotSet(uint256)
                    // Solidity uses the first 4 bytes of the keccak256 hash of
                    // the error signature
                    // "MaxSupplyNotSet(uint256)" to identify the error.
                    let ptr := mload(0x40) // Free memory pointer
                    mstore(ptr, 0x1a3ed2ab) // Error signature for
                    // MaxSupplyNotSet(uint256)
                    mstore(add(ptr, 4), id) // Append the _id parameter right
                    // after the error signature
                    // Revert with the encoded error message.
                    // The total size is 4 bytes (error signature) + 32 bytes
                    // (uint256 _id) = 36 bytes
                    revert(ptr, 36)
                }
                sstore(
                    balanceRegistrarSlot,
                    or(
                        add(and(_SR_UPPERBITS, rawBal), mload(aLoc)),
                        shl(_MINTCOUNT_BITPOS, newBal)
                    )
                )
            }
        }
    }

    /**
     * @notice Before token burn, an internal state-modifying function.
     * @param id The id (uint256).
     * @param amount The amount (uint256).
     * @custom:signature _beforeTokenBurn(uint256,uint256)
     * @custom:selector 0xd703ad60
     */
    function _beforeTokenBurn(uint256 id, uint256 amount)
        internal
        virtual
        override(ERC1155)
    {
        assembly {
            mstore(32, _balanceRegistrar.slot)
            mstore(0, id)
            let sLoc := keccak256(0, 64)
            let _liveSupply := and(_SR_UPPERBITS, sload(sLoc))
            let _newBalance := sub(_liveSupply, amount)
            if or(iszero(_liveSupply), gt(_newBalance, _liveSupply)) {
                // DecOverflow()
                mstore(0x00, 0xce3a3d37)
                revert(0x1c, 0x04)
            }
            sstore(sLoc, _newBalance)
        }
    }

    /**
     * @notice Before token batch burn, an internal state-modifying function.
     * @param ids List of uint256s.
     * @param amounts List of uint256s.
     * @custom:signature _beforeTokenBatchBurn(uint256[],uint256[])
     * @custom:selector 0x5cf7a560
     */
    function _beforeTokenBatchBurn(
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal virtual override(ERC1155) {
        _loopArrayChecks(ids.length, amounts.length);

        assembly {
            let idsLen := mload(ids)
            let iLoc := add(ids, 32)
            let aLoc := add(amounts, 32)
            for { let end := add(iLoc, shl(5, idsLen)) } iszero(eq(iLoc, end)) {
                iLoc := add(iLoc, 32)
                aLoc := add(aLoc, 32)
            } {
                mstore(32, _balanceRegistrar.slot)
                mstore(0, mload(iLoc))
                let sLoc := keccak256(0, 64)
                let _liveSupply := and(_SR_UPPERBITS, sload(sLoc))
                let _newBalance := sub(_liveSupply, mload(aLoc))
                if or(iszero(_liveSupply), gt(_newBalance, _liveSupply)) {
                    // DecOverflow()
                    mstore(0x00, 0xce3a3d37)
                    revert(0x1c, 0x04)
                }
                sstore(sLoc, _liveSupply)
            }
        }
    }

    /**
     * @notice Supports interface, a public pure function.
     * @param interfaceId The interface id (bytes4).
     * @return bool Result of supportsInterface.
     * @custom:signature supportsInterface(bytes4)
     * @custom:selector 0x01ffc9a7
     */
    function supportsInterface(bytes4 interfaceId)
        public
        pure
        virtual
        override(ERC1155, ERC2981)
        returns (bool)
    {
        return
        // ERC165 Interface ID for ERC165
        interfaceId == 0x01ffc9a7
        // ERC165 Interface ID for ERC1155
        || interfaceId == 0xd9b67a26
        // ERC165 Interface ID for ERC1155MetadataURI
        || interfaceId == 0x0e89341c
        // ERC165 Interface ID for ERC2981
        || interfaceId == 0x2a55205a;
    }
}
