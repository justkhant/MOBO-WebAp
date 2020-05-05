# cis550-bm

### mobo
**Contributers:** Adel Wu, Bill (Kehou) Lou, Jina Lo, Kaung Khant

**Mentor:** Kevin Wu :heart:

### Description
Welcome to Mobo, a web-application designed to help you find your new favorite book or movie! You can search our vast database, do advanced searches, filter by movie or book, browse the media's details, see recommendations, and also save specific media you like to your own account.

### Technology Stack
| Technology     | Stack              |
|----------------|--------------------|
| Front-End      | React, CSS  |
| Back-End       | Node, Express      |
| Database       | Oracle, AWS    |

### Web Deployment Instructions
To install Oracle with Node, we followed: https://oracle.github.io/node-oracledb/INSTALL.html#instosx 

Install node-oracledb using the npm package manager, which is included in Node.js:
```javascript
npm install oracledb
```
Download the free Oracle Instant Client ‘Basic’ ZIP file, unzip it, move it into your User root folder, then:
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
