import axios from 'axios';
import axiosRetry from 'axios-retry';
import { HttpsProxyAgent } from 'https-proxy-agent';
import randomUseragent from 'random-useragent';
import { SCRAPING_CONFIG } from '../config/constants.js';

function createHttpClient() {
  const getRandomProxy = () => {
    const proxies = [
      'http://proxy1.example.com:8080',
      'http://proxy2.example.com:8080',
      'http://proxy3.example.com:8080'
    ];
    return proxies[Math.floor(Math.random() * proxies.length)];
  };

  const client = axios.create({
    timeout: SCRAPING_CONFIG.REQUEST_TIMEOUT_MS,
    headers: {
      'User-Agent': randomUseragent.getRandom(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive'
    },
    maxRedirects: 5,
    validateStatus: status => status >= 200 && status < 300
  });

  // Configure retry behavior
  axiosRetry(client, {
    retries: SCRAPING_CONFIG.MAX_RETRIES,
    retryDelay: (retryCount) => {
      const delay = Math.min(
        SCRAPING_CONFIG.RETRY_DELAY_MS * Math.pow(2, retryCount - 1),
        10000
      );
      return delay + Math.random() * 1000;
    },
    retryCondition: (error) => {
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.code === 'ECONNABORTED' ||
        (error.response && error.response.status >= 500)
      );
    },
    onRetry: (retryCount, error, requestConfig) => {
      // Rotate proxy on retry
      const proxy = getRandomProxy();
      requestConfig.httpsAgent = new HttpsProxyAgent(proxy);
      // Rotate user agent on retry
      requestConfig.headers['User-Agent'] = randomUseragent.getRandom();
      console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
    }
  });

  // Add request interceptor for rate limiting
  let lastRequestTime = 0;
  client.interceptors.request.use(async (config) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < SCRAPING_CONFIG.RATE_LIMIT_MS) {
      await new Promise(resolve => 
        setTimeout(resolve, SCRAPING_CONFIG.RATE_LIMIT_MS - timeSinceLastRequest)
      );
    }
    
    lastRequestTime = Date.now();
    return config;
  });

  return client;
}

export default createHttpClient();