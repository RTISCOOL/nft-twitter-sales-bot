import OpenSeaSales from "openseasales";
import Web3 from "web3";
import FetchNftMetadata from "fetch-nft-metadata";
import fs from "fs";
import https from "https";
import { TwitterApi } from "twitter-api-v2";
import request from "request";
var config = JSON.parse(fs.readFileSync("./config.json"));

if (!config["eth-rpc-endpoint"]) {
  console.log("Please specify the eth-rpc-endpoint in the config.json file");
  process.exit(1);
}
if (!config["twitter-consumer-key"]) {
  console.log(
    "Please specify the twitter-consumer-key in the config.json file"
  );
  process.exit(1);
}
if (!config["twitter-consumer-secret"]) {
  console.log(
    "Please specify the twitter-consumer-secret in the config.json file"
  );
  process.exit(1);
}
if (!config["twitter-access-token"]) {
  console.log(
    "Please specify the twitter-access-token in the config.json file"
  );
  process.exit(1);
}
if (!config["twitter-access-token-secret"]) {
  console.log(
    "Please specify the twitter-access-token-secret in the config.json file"
  );
  process.exit(1);
}

var web3Provider = new Web3.providers.HttpProvider(config["eth-rpc-endpoint"]);
var web3 = new Web3(web3Provider);
var MetadataFetch = FetchNftMetadata(config["eth-rpc-endpoint"]);
const client = new TwitterApi({
  appKey: config["twitter-consumer-key"],
  appSecret: config["twitter-consumer-secret"],
  accessToken: config["twitter-access-token"],
  accessSecret: config["twitter-access-token-secret"],
});

console.log("logged into twitter");
var sales = OpenSeaSales({
  provider: config["eth-rpc-endpoint"],
  interval: 1500,
  token: config["token-to-track"],
});
console.log("Watching Sales!");
sales.on("sale", (sale) => {
  console.log("Sale:", sale);
  try {
    postSale(sale);
  } catch (e) {
    console.log(e);
  }
});

async function postSale(sale) {
  MetadataFetch.fetch(sale.token, sale.identifier).then(async (metadata) => {
    if (metadata.image) {
      var image = metadata.image;
      console.log("Downloading image:", image);
      await download(image, "./images/" + sale.identifier + ".png");
      console.log("Uploading image:", image);
      var imageId = await client.v1.uploadMedia(
        "./images/" + sale.identifier + ".png"
      );
      await client.v1.tweet(
        metadata.name +
          " HAS SOLD!\n\nPurchase Price: " +
          sale.salePrice +
          " ETH\n\nBuyer: " +
          sale.recipient +
          "\n\nSeller: " +
          sale.seller +
          "\n\n" +
          "https://opensea.io/assets/ethereum/" +
          sale.token +
          "/" +
          sale.identifier,
        { media_ids: [imageId] }
      );
      console.log("Posted Sale Tweet!");
    }
  });
}
var download = async function (uri, filename) {
  return new Promise(function (resolve, reject) {
    request.head(uri, function (err, res, body) {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on("close", () => resolve());
    });
  });
};
