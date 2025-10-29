// server-setup.js - ONLY the deprecation warning fix
const originalEmit = process.emit;
process.emit = function (name, data, ...args) {
  if (name === 'warning' && 
      data.name === 'DeprecationWarning' && 
      data.message.includes('util.isArray')) {
    return false; // Suppress this specific warning
  }
  return originalEmit.apply(process, arguments);
};

console.log('🔧 Server setup loaded - deprecation warnings suppressed');
