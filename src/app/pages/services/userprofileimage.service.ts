import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserprofileimageService {
  user_profile_image: string = '/assets/img/default-user-profile-image.jpg';    // default user image

  constructor() {
    // this.user_profile_image =  this.user_profile_image;
  }

  getuserprofileimage(getres){
    if(getres.image  == undefined || getres.image  == '' || getres.image  == null){
      this.user_profile_image = '/assets/img/default-user-profile-image.jpg'
    }else{
      this.user_profile_image = getres.image
    }
  }
  fetchUserprofimage(){
    return this.user_profile_image;
  }
}
