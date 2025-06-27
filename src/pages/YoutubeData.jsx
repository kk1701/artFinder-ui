import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoaderHome from "../components/LoaderHome";

const FASTAPI_URL = import.meta.env.VITE_BACKEND_API;

function YoutubeData() {
  const [ytData, setYtData] = useState(null);
  const [images, setImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchYoutubeData = async () => {
      try {
        const ytTable = await axios.get(`${FASTAPI_URL}/youtubeTableData`);
        const ytWC = await axios.get(`${FASTAPI_URL}/getYoutubeWordcloud`);
        const ytBar = await axios.get(`${FASTAPI_URL}/getYoutubeBarGraphs`);

        setYtData(ytTable.data);
        setImages({
          ytWC: ytWC.data.image,
          ytBar: ytBar.data.image
        });
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
      }
    };

    fetchYoutubeData();
  }, []);

  if (!ytData) return (
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

      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">YouTube Analytics</h1>
      
      {/* Videos Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ytData.youtube_titles.map((title, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                    <a href={ytData.youtube_urls[i]} target="_blank" rel="noreferrer" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Watch Video
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat().format(ytData.youtube_views[i])}
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
              src={images.ytWC} 
              alt="YouTube Word Cloud" 
              className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition"
              onClick={() => setSelectedImage(images.ytWC)}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Click image to enlarge</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Sentiment Analysis</h2>
          <div className="flex justify-center">
            <img 
              src={images.ytBar} 
              alt="YouTube Sentiment Analysis" 
              className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition"
              onClick={() => setSelectedImage(images.ytBar)}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Click image to enlarge</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-500 font-medium">Total Videos</p>
            <p className="text-2xl font-bold">{ytData.youtube_titles.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-500 font-medium">Total Views</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat().format(
                ytData.youtube_views.reduce((a, b) => a + b, 0)
              )}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-500 font-medium">Average Views</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat().format(
                Math.round(ytData.youtube_views.reduce((a, b) => a + b, 0) / ytData.youtube_titles.length)
              )}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-500 font-medium">Most Viewed</p>
            <p className="text-xl font-bold truncate">
              {ytData.youtube_titles[
                ytData.youtube_views.indexOf(Math.max(...ytData.youtube_views))
              ]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YoutubeData;