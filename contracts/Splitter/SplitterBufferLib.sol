// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.23;

library SplitterBufferLib {
    /**
     * @notice Payees buffer, an internal view library function.
     * @dev Builds payees dynamic sized array buffer for `createSplitter`cases.
     * @param _amb The amb address.
     * @param _project The project address.
     * @return memOffset List of addresses.
     * @custom:signature payeesBuffer(address,address)
     * @custom:selector 0x3c5e46ec
     */
    function payeesBuffer(address _amb, address _project)
        internal
        view
        returns (address[] memory memOffset)
    {
        memOffset = new address[](3);
        address _msgSender = msg.sender;

        if (_amb == address(0) && _project == address(0)) {
            memOffset = new address[](1);
            memOffset[0] = _msgSender;
        } else if (_project == address(0)) {
            memOffset = new address[](2);
            memOffset[0] = _amb;
            memOffset[1] = _msgSender;
        } else if (_amb == address(0)) {
            memOffset = new address[](2);
            memOffset[0] = _project;
            memOffset[1] = _msgSender;
        } else {
            memOffset = new address[](3);
            memOffset[0] = _amb;
            memOffset[1] = _project;
            memOffset[2] = _msgSender;
        }
    }

    /**
     * @notice Shares buffer, an internal pure library function.
     * @dev Builds shares dynamic sized array buffer for `createSplitter` cases.
     * @param _ambassadorShare The ambassador share (uint256).
     * @param _projectShare The project share (uint256).
     * @return memOffset List of uint256s.
     * @custom:signature sharesBuffer(uint256,uint256)
     * @custom:selector 0x7f571c29
     */
    function sharesBuffer(uint256 _ambassadorShare, uint256 _projectShare)
        internal
        pure
        returns (uint256[] memory memOffset)
    {
        uint256 oneHundredPercent = 10_000;
        if (_ambassadorShare == 0 && _projectShare == 0) {
            memOffset = new uint256[](1);
            memOffset[0] = oneHundredPercent;
        } else {
            if (_projectShare == 0) {
                memOffset = new uint256[](2);
                memOffset[0] = _ambassadorShare;
                memOffset[1] = oneHundredPercent - _ambassadorShare;
            } else if (_ambassadorShare == 0) {
                memOffset = new uint256[](2);
                memOffset[0] = _projectShare;
                memOffset[1] = oneHundredPercent - _projectShare;
            } else {
                memOffset = new uint256[](3);
                memOffset[0] = _ambassadorShare;
                memOffset[1] = _projectShare;
                memOffset[2] =
                    oneHundredPercent - (_ambassadorShare + _projectShare);
            }
        }
        return memOffset;
    }
}
