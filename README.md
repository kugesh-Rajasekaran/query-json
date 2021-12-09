# Query Json
## Problem Description
### 
Your problem for today is a simple one.

You are provided a large folder with JSON data (>100000 files). The data structure for the json files in the folder is not uniform. Some files have the same structure while others do not. Each JSON file can have any number of fields and sub-objects under it. 

Your task
- Find the files which have a given field value in the JSON
- Find files based on a collection of conditions (2+ conditions )
- Rank the results based on size of the file. 

NOTE: Field values for searching can be present in the child objects as well. 

You will be judged on
- Algorithm efficiency 
- Code quality
- Time taken to find results
- Solution Completeness

## Run Application
### 
Do the following procedure to run the application 
- clone the repo
- do npm install
- run npm start for predefined predefined json files and test cases
- else use generate-files.js in utils folder to generate new json files
> note - provide appropriate folder location in main.js (in folderLoc)