// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

import { MAD } from "contracts/MAD.sol";

import { FactoryEventsAndErrorsBase, FactoryVerifier } from "contracts/EventsAndErrors.sol";

import { ERC1155BasicDeployer } from "contracts/lib/deployers/ERC1155Deployer.sol";

import { SplitterDeployer } from "contracts/lib/deployers/SplitterDeployer.sol";

import { Pausable } from "contracts/lib/security/Pausable.sol";
import { Owned } from "contracts/lib/auth/Owned.sol";
import { ReentrancyGuard } from "contracts/lib/security/ReentrancyGuard.sol";
import { DCPrevent } from "contracts/lib/security/DCPrevent.sol";
import { Types, SplitterImpl } from "contracts/Types.sol";
import { ERC20 } from "contracts/lib/tokens/ERC20.sol";

import { CREATE3, Bytes32AddressLib } from "contracts/lib/utils/CREATE3.sol";

// prettier-ignore
abstract contract MADFactoryBase is MAD,
FactoryEventsAndErrorsBase,
    FactoryVerifier,
    ReentrancyGuard,
    DCPrevent(),
    Owned(msg.sender),
    Pausable
{
    using Types for Types.ERC721Type;
    using Types for Types.SplitterConfig;
    using Bytes32AddressLib for address;
    using Bytes32AddressLib for bytes32;

    /// @dev Function SigHash: 0x06fdde03
    function name()
        external
        pure
        override(MAD)
        returns (string memory)
    {
        assembly {
            mstore(0x20, 0x20)
            mstore(0x47, 0x07666163746F7279)
            return(0x20, 0x60)
        }
    }

    ////////////////////////////////////////////////////////////////
    //                           STORAGE                          //
    ////////////////////////////////////////////////////////////////


    /// @dev Maps an collection creator, of type address, to an array of `colIDs`.
    mapping(address => bytes32[]) public  userTokens;

    /// @dev Nested mapping that takes an collection creator as key of 
    /// an hashmap of splitter contracts to its respective deployment configs.
    mapping(address => mapping(address => Types.SplitterConfig))
        public splitterInfo;

    /// @dev Instance of `MADRouter` being passed as parameter of collection's constructor.
    address public router;

    /// @dev Instance of `MADMarketplace` being passed as parameter of `creatorAuth`.
    address public market;

    /// @dev The signer address used for lazy minting voucher validation.
    address private signer;

    /// @dev ERC20 payment token address
    ERC20 public erc20;

    ////////////////////////////////////////////////////////////////
    //                         CONSTRUCTOR                        //
    ////////////////////////////////////////////////////////////////

    constructor
    (
        address _marketplace, 
        address _signer,
        address _paymentTokenAddress
    )
    {
        // F.1 BlockHat Audit
        require(
            _marketplace != address(0) &&
                _signer != address(0),
            "ZeroAddress"
        );
        setMarket(_marketplace);
        setSigner(_signer);
        if (_paymentTokenAddress != address(0)) {
            _setPaymentToken(_paymentTokenAddress);
        }

    }

    /// @notice Enables the contract's owner to change payment token address.
    /// @dev Function Signature := ?
    function _setPaymentToken(address _paymentTokenAddress)
        private
    {
        erc20 = ERC20(_paymentTokenAddress);
        emit PaymentTokenUpdated(_paymentTokenAddress);
    }

    ////////////////////////////////////////////////////////////////
    //                           CORE FX                          //
    ////////////////////////////////////////////////////////////////

    /// @notice Splitter deployment pusher.
    /// @dev Function Sighash := 0x9e5c4b70
    /// @param _splitterSalt Nonce/Entropy factor used by CREATE3 method. Must be always different to avoid address collision.
    /// to generate payment splitter deployment address.
    /// @param _ambassador User may choose from one of the whitelisted addresses to donate
    /// 1%-20% of secondary sales royalties (optional, will be disregarded if left empty(value == address(0)).
    /// @param _ambShare Percentage (1%-20%) of secondary sales royalties to be donated to an ambassador
    /// (optional, will be disregarded if left empty(value == 0)).
    function splitterCheck(
        string memory _splitterSalt,
        address _ambassador,
        address _project,
        uint256 _ambShare,
        uint256 _projectShare
    ) external nonReentrant isThisOg whenNotPaused {
        if (
            _ambassador == address(0) && 
            _project == address(0)) 
        {
            _splitterResolver(
                _splitterSalt,
                address(0), // _ambassador
                address(0), // _project
                0,          // _ambShare
                0,          // _projectShare
                0           // _flag := no project/ambassador
            );

        } else if (
            _ambassador != address(0) &&
            _project == address(0) &&
            _ambShare != 0 && 
            _ambShare < 21 
        ) {
            _splitterResolver(
                _splitterSalt,
                _ambassador, // _ambassador
                address(0),   // _project
                _ambShare,   // _ambShare
                0,            // _projectShare
                1             // _flag := ambassador only
            );

        } else if(
            _project != address(0) && 
            _ambassador == address(0) &&
            _projectShare != 0 &&
            _projectShare < 91
        ) {
            _splitterResolver(
                _splitterSalt,
                address(0),     // _ambassador
                _project,      // _project
                0,              // _ambShare
                _projectShare, // _projectShare
                2               // _flag := project only
            );

        } else if(
            _ambassador != address(0) &&
            _project != address(0) && 
            _ambShare != 0 && 
            _ambShare < 21 &&
            _projectShare != 0 &&
            _projectShare < 71
        ) { 
            _splitterResolver(
                _splitterSalt,
                _ambassador,   // _ambassador
                _project,      // _project
                _ambShare,     // _ambShare
                _projectShare, // _projectShare
                3               // _flag := ambassador and project
            );

        } else { 
            // revert SplitterFail();
            assembly {
                mstore(0x00, 0x00adecf0)
                revert(0x1c, 0x04)
            
            }
        }
    }

  

    ////////////////////////////////////////////////////////////////
    //                         OWNER FX                           //
    ////////////////////////////////////////////////////////////////


    
    /// @dev `MADMarketplace` instance setter.
    /// @dev Function Sighash := 
    function setMarket(address _market) public onlyOwner {
        require(_market != address(0), "Invalid address");
        assembly {
            sstore(market.slot, _market)
        }

        emit MarketplaceUpdated(_market);
    }

    /// @dev `MADRouter` instance setter.
    /// @dev Function Sighash := 0xc0d78655
    function setRouter(address _router) external onlyOwner {
        require(_router != address(0), "Invalid address");
        // router = _router;
        assembly {
            sstore(router.slot, _router)
        }

        emit RouterUpdated(_router);
    }

    /// @dev Setter for EIP712 signer/validator instance.
    /// @dev Function Sighash := 0x6c19e783
    function setSigner(address _signer) public onlyOwner {
        require(_signer != address(0), "Invalid address");
        // signer = _signer;
        assembly {
            sstore(signer.slot, _signer)
        }

        emit SignerUpdated(_signer);
    }

    /// @notice Paused state initializer for security risk mitigation pratice.
    /// @dev Function Sighash := 0x8456cb59
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpaused state initializer for security risk mitigation pratice.
    /// @dev Function Sighash := 0x3f4ba83a
    function unpause() external onlyOwner {
        _unpause();
    }

    ////////////////////////////////////////////////////////////////
    //                           HELPERS                          //
    ////////////////////////////////////////////////////////////////

    /// @notice Everything in storage can be fetch through the 
    /// getters natively provided by all public mappings.
    /// @dev This public getter serve as a hook to ease frontend 
    /// fetching whilst estimating user's colID indexes.
    /// @dev Function Sighash := 0x8691fe46
    function getIDsLength(address _user) 
        external 
        view 
        returns (uint256) 
    {
        return userTokens[_user].length;
    }

    /// @inheritdoc FactoryVerifier
    function getColID(address _colAddress) external pure override(FactoryVerifier) returns (bytes32 colID) {
        colID = _colAddress.fillLast12Bytes();
        
    }



    /// @dev Builds payees dynamic sized array buffer for `splitterCheck` cases.
    function _payeesBuffer(
        address amb, 
        address project) 
    internal 
    view 
    returns (address[] memory memOffset) 
    {
        assembly {
            switch and(
                    iszero(amb),
                    iszero(project)
                    )
            case 1 {
                memOffset := mload(0x40)
                mstore(add(memOffset, 0x00), 1)
                mstore(add(memOffset, 0x20), origin())
                mstore(0x40, add(memOffset, 0x40))
            }
            case 0 {
                switch iszero(project)
                case 1 {
                    memOffset := mload(0x40)
                    mstore(add(memOffset, 0x00), 2)
                    mstore(add(memOffset, 0x20), amb)
                    mstore(add(memOffset, 0x40), origin())
                    mstore(0x40, add(memOffset, 0x60))
                }
                case 0 {
                    switch iszero(amb)
                    case 1 {
                        memOffset := mload(0x40)
                        mstore(add(memOffset, 0x00), 2)
                        mstore(add(memOffset, 0x20), project)
                        mstore(add(memOffset, 0x40), origin())
                        mstore(0x40, add(memOffset, 0x60))
                    }
                    case 0 {
                        memOffset := mload(0x40)
                        mstore(add(memOffset, 0x00), 3)
                        mstore(add(memOffset, 0x20), amb)
                        mstore(add(memOffset, 0x40), project)
                        mstore(add(memOffset, 0x60), origin())
                        mstore(0x40, add(memOffset, 0x80))
                    }
                }
            }
        }
    }

    /// @dev Builds shares dynamic sized array buffer for `splitterCheck` cases.
    function _sharesBuffer(uint256 _ambShare, uint256 _projectShare) 
    internal 
    pure 
    returns (uint256[] memory memOffset) 
    {
        assembly {
            switch and(
                    iszero(_ambShare),
                    iszero(_projectShare)
                    )
            case 1 {
                memOffset := mload(0x40)
                mstore(add(memOffset, 0x00), 1) 
                mstore(add(memOffset, 0x20), 100) 
                mstore(0x40, add(memOffset, 0x40))
            }
            case 0 {
                switch iszero(_projectShare)
                case 1 {
                    memOffset := mload(0x40)
                    mstore(add(memOffset, 0x00), 2)
                    mstore(add(memOffset, 0x20), _ambShare) 
                    mstore(add(memOffset, 0x40), sub(100,_ambShare)) 
                    mstore(0x40, add(memOffset, 0x60))
                }
                case 0 {
                    switch iszero(_ambShare)
                    case 1 {
                        memOffset := mload(0x40)
                        mstore(add(memOffset, 0x00), 2)
                        mstore(add(memOffset, 0x20), _projectShare) 
                        mstore(add(memOffset, 0x40), sub(100,_projectShare)) 
                        mstore(0x40, add(memOffset, 0x60))
                    }
                    case 0 {
                        memOffset := mload(0x40)
                        mstore(add(memOffset, 0x00), 3)
                        mstore(add(memOffset, 0x20), _ambShare) 
                        mstore(add(memOffset, 0x40), _projectShare) 
                        mstore(add(memOffset, 0x60), sub(100,add(_ambShare,_projectShare))) 
                        mstore(0x40, add(memOffset, 0x80))
                    }
                }
            }
        }
    }

    function _splitterResolver(
        string memory _splitterSalt,
        address _ambassador,
        address _project,
        uint256 _ambShare,
        uint256 _projectShare,
        uint256 _flag 
        ) internal 
    {
        address[] memory _payees = 
            _payeesBuffer(_ambassador, _project);

        uint256[] memory _shares = 
            _sharesBuffer(_ambShare,_projectShare);

        (address splitter, bytes32 splitterSalt) = 
        SplitterDeployer._SplitterDeploy(
            _splitterSalt,
            _payees,
            _shares
        );

        splitterInfo[tx.origin][splitter] = Types
        .SplitterConfig(
            splitter,
            splitterSalt,
            _ambassador,
            _project,
            _ambShare,
            _projectShare,
            true
        );

        emit SplitterCreated(
            tx.origin,
            _shares,
            _payees,
            splitter,
            _flag
        );
    } 

    /// @inheritdoc FactoryVerifier
    function creatorAuth(address _token, address _user) 
        external 
        override(FactoryVerifier) 
        view 
        returns(bool stdout) 
    {
        _isMarket();
        if (!_userRender(_user)) { assembly { stdout := 0 } }

        bytes32 buffer = 
            _token.fillLast12Bytes();
        bytes32[] memory digest = 
            new bytes32[](userTokens[_user].length);
        uint256 i;    
        uint256 len = digest.length;
        mapping(address => bytes32[]) storage usrTkns =
            userTokens;
        for (; i < len;) {
            if(buffer == usrTkns[_user][i]) {
                stdout = true;
            } unchecked { ++i; } 
        }
    }



    /// @dev Stablishes sealed/safe callpath for `MADRouter` contract.
    /// @dev Function Sighash := 0xb4d30bec
    function _isRouter() internal view {
        // if (msg.sender != router) revert AccessDenied();
        assembly {
            // let stdin := sload(router.slot)
            // if eq(origin(), sload(router.slot)) {
            if iszero(eq(caller(), sload(router.slot))) {
                mstore(0x00, 0x4ca88867FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
                revert(0, 4) // (offset, length)
            }
        } 
    }

        function _royaltyLocker(uint256 _share) 
    internal 
    pure
    {
        assembly {
            if or(
                gt(_share,0x3E8),
                iszero(iszero(mod(_share,0x19)))) {
                    mstore(0x00, 0xe0e54ced)
                    revert(0x1c, 0x04)
                }
        }
    }


    function _limiter(
        uint8 _tokenType,
        address _splitter
    ) internal view {
        bool val = splitterInfo[tx.origin][_splitter].valid;
        assembly {
            if or(
                /* gt(_tokenType,3) */
                iszero(eq(iszero(0x0),_tokenType)),
                iszero(val)) 
            {
                mstore(0x00,0x4ca8886700000000000000000000000000000000000000000000000000000000)
                revert(0,4)
            }
        }
    }



    /// @dev Stablishes sealed/safe callpath for `MADMarketplace` contract.
    /// @dev Function Sighash := 
    function _isMarket() private view {
        assembly {
            if iszero(eq(caller(), sload(market.slot))) {
                mstore(0x00, 0x4ca88867FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
                revert(0, 4) // (offset, length)
            }
        } 
    }



    /// @notice Private view helper that checks an user against `userTokens` storage slot.
    /// @dev Function Sighash := 0xbe749257
    /// @dev `creatorAuth` method extension.
    /// @return _stdout := 1 as boolean standard output.
    function _userRender(address _user) private view returns(bool _stdout){
        assembly {
            let freeMemoryPointer := mload(0x40)
            mstore(add(freeMemoryPointer, 32), userTokens.slot)
            mstore(add(freeMemoryPointer, 64), _user) 
            let hash := keccak256(freeMemoryPointer, 64)
            if iszero(sload(hash)) {
                _stdout := false
            }
        }
    }

    function getDeployedAddr(string memory _salt)
        external
        view
        returns (
            address
        )
    {
        bytes32 salt = keccak256(bytes(_salt));
        return CREATE3.getDeployed(salt);
    }
}
