//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blog {
    string public name;
    string public saying;
    string public bgImage;
    address public owner;

    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Post {
      uint id;
      string title;
      string desc;
      string content;
      bool published;
    }
    /* mappings can be seen as hash tables */
    /* here we create lookups for posts by id and posts by ipfs hash */
    mapping(uint => Post) private idToPost;
    mapping(string => Post) private hashToPost;

    /* events facilitate communication between smart contractsand their user interfaces  */
    /* i.e. we can create listeners for events in the client and use them in The Graph  */
    event PostCreated(uint id, string title, string desc, string hash);
    event PostUpdated(uint id, string title, string desc, string hash, bool published);

    /* when the blog is deployed, give it a name */
    /* also set the creator as the owner of the contract */
    constructor(string memory _name, string memory _saying, string memory _bgImage ) {
        console.log("Deploying Blog with name:", _name);
        name = _name;
        saying = _saying;
        bgImage = _bgImage;
        owner = msg.sender;
    }

    function updateName(string memory _name) public onlyOwner {
        name = _name;
    }

    function updateSaying(string memory _saying) public onlyOwner {
        saying = _saying;
    }

    function updateBgImage(string memory _bgImage) public onlyOwner {
        bgImage = _bgImage;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    /* fetches an individual post by the content hash */
    function fetchPost(string memory hash) public view returns(Post memory){
      return hashToPost[hash];
    }

    /* creates a new post */
    function createPost(string memory title, string memory desc, string memory hash) public onlyOwner {
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = title;
        post.desc = desc;
        post.published = true;
        post.content = hash;
        hashToPost[hash] = post;
        emit PostCreated(postId, title, desc, hash);
    }

    /* updates an existing post */
    function updatePost(uint postId, string memory title, string memory desc, string memory hash, bool published) public onlyOwner {
        Post storage post =  idToPost[postId];
        post.title = title;
        post.desc = desc;
        post.published = published;
        post.content = hash;
        idToPost[postId] = post;
        hashToPost[hash] = post;
        emit PostUpdated(post.id, title, desc, hash, published);
    }

    /* fetches all posts */
    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postIds.current();

        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Post storage currentItem = idToPost[currentId];
            posts[i] = currentItem;
        }
        return posts;
    }

    /* this modifier means only the contract owner can */
    /* invoke the function */
    modifier onlyOwner() {
      require(msg.sender == owner);
    _;
  }
}