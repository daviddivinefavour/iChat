const moment = require('moment');

exports.formatMessage = (username,msg)=>{
     return {
          username,
          msg,
          time: moment().format('h:mm a')
     }
};
