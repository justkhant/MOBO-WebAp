
# mobo :movie_camera: :orange_book:
### CIS 550 - Spring 2020
**Contributers:** Adel Wu, Bill (Kehao) Lou, Jina Lo, Kaung Khant

**Mentor:** Kevin Wu :heart:

### Description
Welcome to Mobo, a web-application designed to help you find your new favorite book or movie! You can search our vast database, do advanced searches, filter by movie or book, browse the media's details, see recommendations, and also save specific media you like to your own account.

### Technology Stack :computer:
| Technology     | Stack              |
|----------------|--------------------|
| Front-End      | React, CSS  |
| Back-End       | Node, Express      |
| Database       | Oracle, AWS    |

Our datasets came from Kaggle, [Movies](https://www.kaggle.com/rounakbanik/the-movies-dataset#movies_metadata.csv) and [Books](https://www.kaggle.com/meetnaren/goodreads-best-books). 
Together, they amount to over 90,000+ media pieces.

### Web Deployment Instructions
To install Oracle with Node, we followed (we all have MacOS): https://oracle.github.io/node-oracledb/INSTALL.html#instosx 

Install node-oracledb using the npm package manager, which is included in Node.js:
```javascript
npm install oracledb
```
Download the free Oracle Instant Client ‘Basic’ ZIP file (depends on computer), unzip it, move it into your ~/ folder, then:
```javascript
mkdir ~lib
ln -s ~/instantclient_19_3/libclntsh.dylib ~/lib/
```

General info:
```javascript
// install dependencies for both server & client
npm install 

// run both client & server
npm start

// server runs on http://localhost:8081 and client on http://localhost:3000
```
