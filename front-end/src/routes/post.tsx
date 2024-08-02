import React, { useEffect, useState } from "react";
import { API_URL } from "../auth/constants";
import { useAuth } from "../auth/AuthProvider";

export default function Post({ post }) {
    const [likes, setLikes] = useState([]);
    const auth = useAuth();
    const user = auth.getUser();

    useEffect(() => {
        fetchLikes();
    }, []);

    async function fetchLikes() {
        try {
            const response = await fetch(`${API_URL}/posts/${post._id}/likes`);
            if (response.ok) {
                const likesData = await response.json();
                setLikes(likesData);
            }
        } catch (error) {
            console.error("Error al cargar los likes", error);
        }
    }

    async function handleLike() {
        try {
            const response = await fetch(`${API_URL}/posts/${post._id}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.getAccessToken()}`,
                },
            });

            if (response.ok) {
                fetchLikes(); // Actualiza los likes después de dar like
            }
        } catch (error) {
            console.error("Error al dar like", error);
        }
    }

    async function handleUnlike() {
        try {
            const response = await fetch(`${API_URL}/posts/${post._id}/unlike`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.getAccessToken()}`,
                },
            });

            if (response.ok) {
                fetchLikes(); // Actualiza los likes después de quitar like
            }
        } catch (error) {
            console.error("Error al quitar like", error);
        }
    }

    const isLiked = likes.some(like => like._id === user?.id);

    return (
        <div className="post">
            <p>{post.content}</p>
            <button onClick={isLiked ? handleUnlike : handleLike}>
                {isLiked ? "Unlike" : "Like"}
            </button>
            <div>
                <p>{likes.length} Likes</p>
                <ul>
                    {likes.map(like => (
                        <li key={like._id}>{like.username}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}