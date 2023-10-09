# SpaceGeo
## Nasa Space Apps submission for the Become a Space Geologist Challenge

![alt text](/images/IntroPage.png)

## Earth Model and Milky Way Background are from NASA

![alt text](/images/NasaMilkyWayAndEarth.png)

## Select anywhere on the globe to retrieve NASA EMIT data

![alt text](/images/ClickAnywhere.png)

## Alternatively, search by name or coordinates. 

![alt text](/images/SearchFeature.png)


# Instructions
### To get started 
For Python you'll need Flask, Matplotlib, and Earthaccess all installed.
For JavaScript you'll need Node, React, Three.js, and Tailwind installed.

### To Run
You'll need two terminals.
First run app.py in /back, this is the server.
Then run npm start inside of /app.

# Overview

My app allows users to fetch NASA's EMIT data by selecting points on an interactive globe or by searching specific coordinates. The EMIT data presents geologists with multiple time and space specified photographs of a selected region as well as links to download the entire EMIT data for that location. There are two types of photographs which are displayed: EMIT 2a and 2b. In particular EMIT 2b gives geologists spectroscopic images of the terrain, which is more informative for their research. If the geologists wish to study more, the provided links guide them to more "nitty-gritty" data. One advantage of my app is it's speed. In my experience, browsers usually get very slow when running NASA's data retrieval websites. In my project I overcome this by including an intermediary server between NASA and the browser which cache's data. Additionally data is only retrieved as needed, ensuring a fast and reactive user experience.

# Details

My project consists of a React + Three.js front end and a Flask back end.

The back end is actually very simple, it acts as a cache and parser between the front end and the NASA Earthaccess API. It receives a longitude and latitude point as input and then it sends a request to Earthaccess specifically for EMIT data (though this will be expanded on in the future when I do more research on other geology data that NASA provides). The data is then filtered for specific content such as images, boundary, and time. Finally, the data is stored in a simple cache before sending it to the front end, so that users can quickly access previous content.

Meanwhile, the front end is split into components which communicate with each other. On the left I have a dedicated region for React where I handle user input and backend API calls and on the right there's a Three.js scene which handles user input.

The left receives the selected point from the scene or from user input, makes a request to the backend, and then after receiving the data it transmits information about the selected areas border to be rendered in the Three.js scene. The search function makes a call to Geoapify in order to retrieve coordinates. The React container is also responsible for displaying the received data to the user and presents an introductory how to page when first beginning. The styling is all done using Tailwind.

The right consists of a globe, an encompassing sphere, and when selected, a boundary mesh. The globe is a gltf model and the sphere is a Three.js built-in mesh with a milky way texture, both downloaded from NASA websites. When the React container sends boundary information to the scene, the scene then creates and renders the boundary mesh.

All combined, the components of this app work together to make NASA data accessible to geologists, providing them an intuitive interface and speeding up and simplifying access to sometimes daunting amounts of data.

# Demo

https://youtu.be/ZrdriLwJXfc

# References

https://search.earthdata.nasa.gov/search

https://earth.jpl.nasa.gov/emit/

https://github.com/nasa/EMIT-Data-Resources/

https://science.nasa.gov/resource/earth-3d-model/

https://svs.gsfc.nasa.gov/4851/

https://threejs.org/docs/#manual/en/introduction/Creating-a-scene

https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/#about
