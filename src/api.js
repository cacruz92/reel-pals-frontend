import axios from "axios";

const BASE_URL = "http://www.omdbapi.com/";
const API_KEY = "3ceade25"

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class OmdbApi {
  static async request(params = {}) {
    console.debug("API Call:", params);

    params = {...params, apikey: API_KEY};

    try {
      return (await axios.get( BASE_URL, { params })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.Error || "An error occurred";
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  static async searchMovies(title, year = ""){
    return await this.request({s: title, y: year, type: "movie"});
  }

  static async getMovieDetails(id){
    return this.request({ i: id, plot:"full"})
  }

}




export default OmdbApi;