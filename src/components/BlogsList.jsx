// /src/components/BlogList.jsx
import { useEffect, useState } from "react";
import { getPosts } from "../data/blogPost";

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((data) => setPosts(data));
  }, []);

  return (
    <div>
      {posts.length === 0 ? (
        <p>Loading...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post">
            <img src={post.image} alt={post.title} />
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p>{post.date}</p>
            <span>{post.tag}</span>
          </div>
        ))
      )}
    </div>
  );
}
