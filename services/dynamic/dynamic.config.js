// See documentation for more information 

self.__dynamic$config = {
  prefix: '/classes/dyn/',
  encoding: 'xor',
  mode: 'production', 
  logLevel: 0, 
  bare: {
    version: 2, 
    path: '/bare/',
  },
  tab: {
    title: 'Website',
    icon: null,
    ua: null,
  },
  assets: {
    prefix: '/work/',
    files: {
      handler: 'dynamic.handler.js',
      client: 'dynamic.client.js',
      worker: 'dynamic.worker.js',
      config: 'dynamic.config.js',
      inject: null,
    }
  },
  block: [
  
  ]
};
