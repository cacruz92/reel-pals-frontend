import React, {useState, useContext} from "react";
import OmdbApi from "./api";
import {UserContext} from "./UserContext";
import { Button } from "reactstrap";

const LikeButton = ({reviewId, initialLikeCount, initialIsLiked}) =>{
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const {currentUser} = useContext(UserContext);

    const handleLike = async () => {
        if(!currentUser)return;

        try {
            if (isLiked) {
                await OmdbApi.removeLike(reviewId, currentUser.username);
                setLikeCount(prev => prev - 1);
            } else {
                await OmdbApi.addLike(reviewId, currentUser.username);
                setLikeCount(prev => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (e) {
            console.error("Error toggling like button", e);
        }
    };
    return(
        <Button onClick={handleLike}>
            {isLiked ? "Unlike" : "Like"} ({likeCount})
        </Button>
    );
};

export default LikeButton;