import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoaderHome from "../components/LoaderHome";

const FASTAPI_URL = import.meta.env.VITE_BACKEND_API;

function RedditData() {
  const [redditData, setRedditData] = useState(null);
  const [images, setImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchRedditData = async () => {
      try {
        const [redditTable, redditWC, redditBar] = await Promise.all([
          axios.get(`${FASTAPI_URL}/redditTableData`),
          axios.get(`${FASTAPI_URL}/getRedditWordCloud`),
          axios.get(`${FASTAPI_URL}/getRedditBarGraph`),
        ]);

        setRedditData(redditTable.data);
        setImages({
          redditWC: redditWC.data.image,
          redditBar: redditBar.data.image,
        });
      } catch (error) {
        console.error('Error fetching Reddit data:', error);
      }
    };

    fetchRedditData();
  }, []);

  if (!redditData) return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <LoaderHome />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              className="w-full h-auto max-h-screen object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">Reddit Analytics</h1>
      
      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {redditData.reddit_titles.map((title, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                    {title.length > 100 ? `${title.substring(0, 100)}...` : title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                    <a href={redditData.reddit_urls[i]} target="_blank" rel="noreferrer" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                      </svg>
                      View Post
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat().format(redditData.reddit_scores[i])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Word Cloud</h2>
          <div className="flex justify-center">
            <img 
              src={images.redditWC} 
              alt="Reddit Word Cloud" 
              className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition"
              onClick={() => setSelectedImage(images.redditWC)}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Click image to enlarge</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Sentiment Analysis</h2>
          <div className="flex justify-center">
            <img 
              src={images.redditBar} 
              alt="Reddit Sentiment Analysis" 
              className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition"
              onClick={() => setSelectedImage(images.redditBar)}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Click image to enlarge</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-500 font-medium">Total Posts</p>
            <p className="text-2xl font-bold">{redditData.reddit_titles.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-500 font-medium">Total Score</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat().format(
                redditData.reddit_scores.reduce((a, b) => a + b, 0)
              )}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-500 font-medium">Average Score</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat().format(
                Math.round(redditData.reddit_scores.reduce((a, b) => a + b, 0) / redditData.reddit_titles.length)
              )}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-500 font-medium">Top Post</p>
            <p className="text-xl font-bold truncate">
              {redditData.reddit_titles[
                redditData.reddit_scores.indexOf(Math.max(...redditData.reddit_scores))
              ]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RedditData;