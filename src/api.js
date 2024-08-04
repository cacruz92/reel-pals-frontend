import axios from "axios";

const BASE_URL = "http://www.omdbapi.com/";
const API_KEY = "3ceade25";
const AUTH_BASE_URL = "http://localhost:3001";


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
    } catch (err) {
      console.error("Omdb API Error:", err.response);
      let message = err.response.data.Error || "An error occurred";
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async authRequest(endpoint, data = {}, method = "get") {
    console.debug("Auth API Call:", endpoint, data, method);

      const url = `${AUTH_BASE_URL}/${endpoint}`;
      const headers = { Authorization: `Bearer ${OmdbApi.token}`};

    try {
      return (await axios({
        url,
        method,
        data,
        headers
      })).data;
    } catch (err) {
      console.error("Auth API Error:", err.response);
      let message = err.response.data.Error || "An error occurred";
      throw Array.isArray(message) ? message : [message];
    }
  }


  // Individual API routes

  static async searchMovies(title, year = ""){
    return await this.omdbRequest({s: title, y: year, type: "movie"});
  }

  static async getMovieDetails(id){
    return this.omdbRequest({ i: id, plot:"full"})
  }

  // User methods
    /** Register a new user */

    static async register(userData){
      let res = await this.authRequest("users/register", userData, "post")
      this.token = res.token;
      return res.token;
    }
  
    /** Login user */
  
    static async login(userData){
      let res = await this.authRequest("users/login", userData,"post")
      this.token = res.token;
      return res.token;
    }

    /** Get current user */
  
    static async getCurrentUser(username){
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

    // Review methods

    /** Add a new review */

    static async addReview(reviewData){
      let res = await this.authRequest("reviews/add", reviewData, "post")
      return res;
    }    

    /** Add a review */

    static async editReview(reviewData){
      let res = await this.authRequest(`/reviews/${reviewId}`, reviewData, "patch");
      return res;
    }

    /** Delete a review */

    static async removeReview(reviewId){
      let res = await this.authRequest(`/${reviewId}`, {}, "delete")
      return res;
    }

    /** Find all reviews made by a specific user */
    
    static async findUserReviews(userId){
      let res = await this.authRequest(`/reviews/${userId}`)
      return res;
    }

    /** Add tag to a review */

    static async addTag(reviewId, tagName){
      let res = await this.authRequest(`/reviews/${reviewId}/tag`, {tagName}, "post")
      return res;
    }

    /** Remove a tag from a review */

    static async removeTag(reviewId, tagName){
      let res = await this.authRequest(`/reviews/${reviewId}/tag/${tagName}`, {}, "delete");
      return res;
    }  

    /** Get tags associated with a specific review */

    static async getTagsByReview(reviewId){
      let res = await this.authRequest(`/reviews/${reviewId}/`)
      return res;
    }

    /** Get reviews associated with a particular tag */

    static async getReviewByTags(tagName){
      let res = await this.authRequest(`/reviews/tags/${tagName}`)
      return res;
    }

    //Comment methods

    /** Add a comment */

    static async addComment(reviewId, userId, body){
      let res = await this.authRequest(`/reviews/${reviewId}/comments/add`, {userId, body}, "post");
      return res;
    }

    /** Edit a comment */

    static async editComment(reviewId, commentId, data){
      let res = await this.authRequest(`/reviews/${reviewId}/comments/${commentId}`, data, "patch");
      return res;
    }

    /** Delete a comment */

    static async deleteComment(reviewId, commentId){
      let res = await this.authRequest(`/reviews/${reviewId}/comments/${commentId}`, {}, "delete");
      return res;
    }

    /** Find all comments made on a specific review */

    static async findReviewComments(reviewId){
      let res = await this.authRequest(`/reviews/${reviewId}/comments`);
      return res;
    }

    //Like methods

    /** Add a like to a review */

    static async addLike(reviewId, userId){
      let res = await this.authRequest(`/reviews/${reviewId}/like`, { userId }, "post");
      return res;
    }

    /** Remove a like from a review */

    static async removeLike(reviewId, userId){
      let res = await this.authRequest(`/reviews/${reviewId}/like`, { userId }, "delete");
      return res;
    }
}




export default OmdbApi;