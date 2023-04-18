// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.16;

///     ...     ..      ..                    ..
///   x*8888x.:*8888: -"888:                dF
///  X   48888X `8888H  8888               '88bu.
/// X8x.  8888X  8888X  !888>        u     '*88888bu
/// X8888 X8888  88888   "*8%-    us888u.    ^"*8888N
/// '*888!X8888> X8888  xH8>   .@88 "8888"  beWE "888L
///   `?8 `8888  X888X X888>   9888  9888   888E  888E
///   -^  '888"  X888  8888>   9888  9888   888E  888E
///    dx '88~x. !88~  8888>   9888  9888   888E  888F
///  .8888Xf.888x:!    X888X.: 9888  9888  .888N..888
/// :""888":~"888"     `888*"  "888*""888"  `"888*""
///     "~'    "~        ""     ^Y"   ^Y'      ""     MADNFTs © 2022.

/// GNU AFFERO GENERAL PUBLIC LICENSE
/// Version 3, 19 November 2007
///
/// Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
/// Everyone is permitted to copy and distribute verbatim copies
/// of this license document, but changing it is not allowed.
///
/// (https://spdx.org/licenses/AGPL-3.0-only.html)

abstract contract MAD {
    function name() external pure virtual returns (string memory);
}
