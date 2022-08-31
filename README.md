
# NodeJS Opensea NFT Sales Twitter Bot  

This bot will track NFT sales as they happen and post them on your twitter.




## Installation

Clone this github repo or download a zip and unzip it

```bash
  git clone https://github.com/RTISCOOL/nft-twitter-sales-bot.git
  cd nft-twitter-sales-bot
  npm install
```
    
## The Config

Create a twitter app at https://developer.twitter.com. Make sure you have READ / WRITE access or the app wont be able to post tweets

```javascript
{
  "token-to-track": "", // token contract address of the nft you want to track.
  "twitter-bearer-token": "",
  "eth-rpc-endpoint": "", // ethereum RPC endpoint
  "twitter-consumer-key": "",
  "twitter-consumer-secret": "",
  "twitter-access-token": "",
  "twitter-access-token-secret": ""
}
```
## Usage/Examples
Fill out the Config.json file and run npm-start

```bash
npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## Authors

- Ryan Trattner [@RTISCOOL](https://www.github.com/RTISCOOL)


## License

[MIT](https://choosealicense.com/licenses/mit/)


