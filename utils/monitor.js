var osutils = require("os-utils");
const logger = require("./logger.js").Logger;

module.exports = {
  plataform(){return("Platform: " + osutils.platform())},
  cpu(){return("Number of CPUs: " + osutils.cpuCount())},
  cpu_use_server(){osutils.cpuUsage((v) => {logger.server("CPU Usage (%) : " + v)})},
  cpu_use_info(){osutils.cpuUsage((v) => {logger.info("CPU Usage (%) : " + v)})},
  cpu_use_error(){osutils.cpuUsage((v) => {logger.error("CPU Usage (%) : " + v)})},
  cpu_use_debug(){osutils.cpuUsage((v) => {logger.debug("CPU Usage (%) : " + v)})},
  avg(){return("Load Average (5m): " + osutils.loadavg(5))},
  total_memory(){return("Total Memory: " + osutils.totalmem() + "MB")},
  free_memory(){return("Free Memory: " + osutils.freemem() + "MB")},
  percent_free_memory(){return("Free Memory (%): " + osutils.freememPercentage())},
  uptime(){return("System Uptime: " + osutils.sysUptime() + "ms")}
}

