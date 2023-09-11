module.exports = {
    apps: [
      {
        name: 'api.consumers.agentsoncloud.com', // change to your subdomain name 
        instances : "8",
    	  exec_mode : "cluster",
        script: 'index.js', // change to your index.js entrypoint
      },
    ],
  }
  

