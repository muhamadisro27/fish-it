// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FishItNFT is ERC721, ERC721URIStorage, Ownable {
    string public basePinataGateway = "https://gateway.pinata.cloud/ipfs/";
    uint256 private _nextTokenId;

    constructor(
        address initialOwner
    ) ERC721("FishIt NFT", "FISH") Ownable(initialOwner) {}

    function safeMint(
        address to,
        string memory uri
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(
            ownerOf(tokenId) != address(0),
            "URI query for nonexistent token"
        );
        string memory storedURI = super.tokenURI(tokenId);
        return string(abi.encodePacked(basePinataGateway, storedURI));
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
