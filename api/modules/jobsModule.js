import cron from "node-cron" ;
import express from 'express';
import {getAllparking,expiredArrived,notificationArrived,deleteParkingById} from './parkingModule.js';
import {getUserById,setSocialScore} from './userModule.js';
import {ExpiresSoonNotification} from './emailer.js';
const app = express();

const check = async () => {
    var reservations = await getAllparking();
    for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i];

        if(reservation.to_time - Date.now() < -900000){
            var user = await getUserById(reservation.user_id);
            if(user!= null){
              var email = user.email;
              await PenaltyNotification(email);

              if(user.social_score  != 0){
                await setSocialScore(user._id,user.social_score-1);
              }else{
                var time =  Date.now();
                var set = await setBantime(user._id,time+1036800000);
              }
              await deleteParkingById(reservation._id);
            }  
            continue;
        }
        if(reservation.to_time - Date.now() < 0 && reservation.expired == false){
            var user = await getUserById(reservation.user_id);
            if(user!= null){
              var email = user.email;
              await ExpiredNotification(email);
              await expiredArrived(reservation._id);
            }
            continue;
        }

        if(reservation.to_time - Date.now() < 900000 && reservation.notified == false){
           var user = await getUserById(reservation.user_id);
              if(user!= null){
                var email = user.email;
                await ExpiresSoonNotification(email);
                await notificationArrived(reservation._id);
                continue
              }
        }
        
        if(Date.now() - reservation.from_time > 86400000 && reservation.car_on_place == false){
          var user = await getUserById(reservation.user_id);
          if(user!= null){
            var email = user.email;
            await PenaltyNotification(email);

            if(user.social_score  != 0){
              await setSocialScore(user._id,user.social_score-1);
            }
            await deleteParkingById(reservation._id);
          }  
          continue;
        }
    }
}

cron.schedule("*/15 * * * * *", check);

app.listen(3000, () => {
  console.log("Notifications on");
});