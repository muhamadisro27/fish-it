// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FishItNFT is ERC721, ERC721URIStorage, Ownable {
    string public basePinataGateway = "https://gateway.pinata.cloud/ipfs/";
    uint256 private _nextTokenId;

    mapping(address => bool) public minters;

    event MinterSet(address indexed minter, bool status);

    constructor(
        address initialOwner
    ) ERC721("FishIt NFT", "FISH") Ownable(initialOwner) {}

    modifier onlyMinter() {
        require(
            msg.sender == owner() || minters[msg.sender],
            "Not authorized to mint"
        );
        _;
    }

    function setMinter(address minter, bool status) external onlyOwner {
        minters[minter] = status;
        emit MinterSet(minter, status);
    }

    function safeMint(
        address to,
        string memory uri
    ) external onlyMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function tokensOfOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 total = _nextTokenId;
        uint256 count = balanceOf(owner);
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    result[index++] = i;
                }
            } catch {
                // skip non-existent tokenId
            }
        }

        return result;
    }

    function tokenURIsOfOwner(
        address owner
    ) external view returns (string[] memory) {
        uint256 total = _nextTokenId;
        uint256 count = balanceOf(owner);
        string[] memory uris = new string[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < total; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    string memory storedURI = super.tokenURI(i);
                    uris[index++] = string(
                        abi.encodePacked(basePinataGateway, storedURI)
                    );
                }
            } catch {
                // skip non-existent tokenId
            }
        }

        return uris;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        string memory storedURI = super.tokenURI(tokenId);
        return string(abi.encodePacked(basePinataGateway, storedURI));
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }
}
