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

  // user methods
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
      return this.authRequest(`users/$username`);
    }

}




export default OmdbApi;