const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Blog", async function () {
  it("Should create a post", async function () {
    // Gets the contract from the hardhat library
    // Finds contract called blog 
    const Blog = await ethers.getContractFactory("Blog")
    // Deploy the contract, similar to starting state machine or instantiating a class
    const blog = await Blog.deploy("My blog")
    // Wait till deployed
    await blog.deployed()
    // Use the createPost function
    await blog.createPost("My first post", "12345")

    // Get posts using blog contract and fetch posts function
    const posts = await blog.fetchPosts()
    // Firs element in the array should be the one we just created
    expect(posts[0].title).to.equal("My first post")
  })

  it("Should edit a post", async function () {
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    await blog.deployed()
    await blog.createPost("My Second post", "12345")

    await blog.updatePost(1, "My updated post", "23456", true)

    posts = await blog.fetchPosts();
    expect(posts[0].title).to.equal("My updated post")
  })

  it("Should add update the name", async function () {
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    await blog.deployed()

    expect(await blog.name()).to.equal("My blog")
    await blog.updateName('My new blog')
    expect(await blog.name()).to.equal("My new blog")
  })

  it("Should create two different blog posts and then update the second name", async () => {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My Blog");
    await blog.deployed();

    await blog.createPost("First post", "1");
    await blog.createPost("Second post", "2");

    const blogPosts = await blog.fetchPosts();
    expect(blogPosts.length).to.equal(2);

    await blog.updatePost(2, "Second Updated Post", "3", true);
    const newBlogPosts = await blog.fetchPosts();
    expect(newBlogPosts.length).to.equal(2);
    expect(newBlogPosts[1].title).to.equal("Second Updated Post");
  });

  it("Should create two different contracts for the blog and add a blog post to each one", async () => {

    const BlogContractFactory = await ethers.getContractFactory("Blog");
    
    const blogOne = await BlogContractFactory.deploy("Blog 1");
    await blogOne.deployed();

    const blogTwo = await BlogContractFactory.deploy("Blog 2");
    await blogTwo.deployed();

    await blogOne.updateName("Blog New One");

    const blogOneName = await blogOne.name();
    const blogTwoName = await blogTwo.name();

    expect(blogOneName).to.equal("Blog New One");
    expect(blogTwoName).to.equal("Blog 2");
  });

  it("Should throw an error as the id passed in does not exist", async () => {

      const BlogContractFactory = await ethers.getContractFactory("Blog");
      let errorThrown = false;

      const blog = await BlogContractFactory.deploy("Blog");
      await blog.deployed();

      await blog.createPost("Post one", "HashOne");
      await blog.createPost("Post two", "HashTwo");
      await blog.createPost("Post three", "HashThree");

      try {
        await blog.deletePost(4, "HashFour");
      } catch (err) {
        expect(err.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Post does not exist'");
        errorThrown = true;
      }

      expect(errorThrown).to.equal(true);
  });

  it("Should delete one of the three posts", async () => {

    const BlogContractFactory = await ethers.getContractFactory("Blog");
    let errorThrown = false;

    const blog = await BlogContractFactory.deploy("Blog");
    await blog.deployed();

    await blog.createPost("Post one", "HashOne");
    await blog.createPost("Post two", "HashTwo");
    await blog.createPost("Post three", "HashThree");

    await blog.deletePost(2, "HashTwo");

    const posts = await blog.fetchPosts();

    expect(posts.length).to.equal(2);
    expect(posts[0].title).to.equal("Post one");
    expect(posts[1].title).to.equal("Post three");

});
})