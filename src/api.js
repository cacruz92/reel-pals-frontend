import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://www.omdbapi.com/";
const API_KEY = "3ceade25";
const AUTH_BASE_URL = "http://localhost:3001/";


/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class OmdbApi {
  static async omdbRequest(params = {}) {
    console.debug("Omdb API Call:", params);

    params = {...params, apikey: API_KEY};

    try {
      return (await axios.get( BASE_URL, { params })).data;
    } catch (e) {
      console.error("Omdb API Error:", e.response);
      let message = e.response.data.Error || "An error occurred";
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async authRequest(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${AUTH_BASE_URL}${endpoint}`;
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const params = (method === "get")
        ? data
        : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (e) {
      console.error("API Error:", e.response);
      let message = e.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }

    // console.debug("Auth API Call:", endpoint, data, method);

    // const url = `${AUTH_BASE_URL}${endpoint}`;
    // const token = localStorage.getItem('token');
    // const headers = { Authorization: `Bearer ${token}`};

    // try {
    //   const response = await axios({
    //     url,
    //     method,
    //     data,
    //     headers
    //   });

    //   return response.data;

    // } catch (e) {
    //   console.error("Auth API Error:", e.response);
    //   let message = e.response.data.Error || "An error occurred";
    //   throw Array.isArray(message) ? message : [message];
    // }
  }


  // Movie methods

  static async searchMovies(title, year = ""){
    const result = await this.omdbRequest({s: title, y: year, type: "movie"});
    return result;
  }

  static async getMovieDetails(id){
    const movieData = await this.omdbRequest({ i: id, plot:"full"});
    await this.addMovie(movieData);
    return movieData
  }

  static async addMovie(movieData){
    try{
      let res = await this.authRequest(`movies/add`, movieData, "post");
      return res;
    }catch(e){
      console.error("Error adding movie:", e);
      throw e;
    }
  }


  // User methods
    /** Register a new user */

    static async register(userData){
      let res = await this.authRequest("users/register", userData, "post")
      this.token = res.token;
      return {token: res.token, user: res.user };
    }
  
    /** Login user */
  
    static async login(userData){
      let res = await this.authRequest("users/login", userData,"post")
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
    }
    

    /** Get current user */
  
    static async getCurrentUser(token){
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;
      let res = await this.authRequest(`users/${username}`);
      return res;
    }

    /** Get user profile */
  
    static async getUserProfile(username){
      let res = await this.authRequest(`users/${username}`);
      return res;
    }

    /** Update user */
  
    static async updateUserProfile(username, userData){
      let res = await  this.authRequest(`users/${username}`, userData, "patch");
      return res;
    }

    /** Delete user */
  
    static async removeUser(username){
      let res = await this.authRequest(`users/${username}`, {}, "delete");
      return res;
    }

    /** Search for a User */
    static async searchByUser(searchTerm){
      let res = await this.authRequest(`users/search?term=${searchTerm}`);
      return res;
    }

    //Follow methods

    /** Follow a user */
    
    static async followUser(followerUsername, followedUsername){
      let res = await this.authRequest(`users/${followedUsername}/follow`, {followerUsername}, "post");
      return res;
    }

    /** Unfollow a user */

    static async unfollowUser(followerUsername, followedUsername){
      let res = await this.authRequest(`users/${followedUsername}/follow`, {followerUsername}, "delete");
      return res;
    }

    /** Get a user's followers */

    static async getUserFollowers(username){
      let res = await this.authRequest(`users/${username}/followers`);
      return res.followers;
    }

    /** Gets users followed by user */

    static async getUserFollowing(username){
      let res = await this.authRequest(`users/${username}/following`);
      return res.following;
    }

    // Review methods

    /** Add a new review */

    static async addReview(reviewData){
      let res = await this.authRequest("reviews/add", reviewData, "post")
      return res;
    }    

    /** Edit a review */

    static async editReview(reviewId, reviewData){
      let res = await this.authRequest(`reviews/${reviewId}`, reviewData, "patch");
      return res;
    }

    /** Delete a review */

    static async removeReview(reviewId){
      let res = await this.authRequest(`reviews/${reviewId}`, {}, "delete")
      return res;
    }

    /** Find all reviews made by a specific user */
    
    static async findUserReviews(username){
      let res = await this.authRequest(`reviews/user/${username}`)
      return res;
    }

    /** Get Review by review ID */
    static async getReview(reviewId){
      let res = await this.authRequest(`reviews/${reviewId}`)
      return res;
    }

    /** Add a comment to a review */
    static async addComment(reviewId, body){
      let res = await this.authRequest(`reviews/${reviewId}/comments/add`, {body}, "post");
      return res.comment;
    }

    /** Remove a comment from a review */
    static async removeComment(reviewId, commentId){
      let res = await this.authRequest(`reviews/${reviewId}/comments/${commentId}`, {}, "delete");
      return res.comment;
    }

    /** Generate user feed */

    static async getUserFeed(username){
      let res = await this.authRequest(`reviews/feed/${username}`);
      return res.feed;
    }

    //Comment methods


    /** Edit a comment */

    static async editComment(reviewId, commentId, data){
      let res = await this.authRequest(`reviews/${reviewId}/comments/${commentId}`, data, "patch");
      return res;
    }

    /** Delete a comment */

    static async deleteComment(reviewId, commentId){
      let res = await this.authRequest(`reviews/${reviewId}/comments/${commentId}`, {}, "delete");
      return res;
    }

    /** Find all comments made on a specific review */

    static async findReviewComments(reviewId){
      let res = await this.authRequest(`reviews/${reviewId}/comments`);
      return res;
    }

    //Like methods

    /** Add a like to a review */

    static async addLike(reviewId, username){
      let res = await this.authRequest(`reviews/${reviewId}/like`, { username }, "post");
      return res;
    }

    /** Remove a like from a review */

    static async removeLike(reviewId, username){
      let res = await this.authRequest(`reviews/${reviewId}/like`, { username }, "delete");
      return res;
    }

    /**Get like count */
    
    static async getLikeCount(reviewId) {
      let res = await this.authRequest(`reviews/${reviewId}/likes`);
      return res.likeCount;
    }
  }
export default OmdbApi;