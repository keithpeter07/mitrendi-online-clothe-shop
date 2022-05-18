



const reset_pass_email_gen = (name, modify_tk) => {
    const cap_name = name[0].toUpperCase() + name.substring(1).toLowerCase()

    const html = `
        <html>
            <style>
                .action_name:hover{
                    transform: scale(102%);
                }
                .action_name:focus{
                    transform: scale(102%);
                }
                .action_name:active{
                    transform: scale(99%);
                }
            </style>
            <body style="margin: auto; padding-top: 2rem; padding-bottom: 2rem; display: flex; justify-content: center; align-items: center; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; background-color: #eeeeee;">
                <div style="margin: 0; margin-left: auto; margin-right: auto; display: flex; justify-content: center; align-items: center; background-color: white; width: fit-content; padding: 3rem; padding-left: .2rem; padding-right: .2rem; border-radius: 10px;">
                    <div style="margin: auto;">

                        <div>
                            <div style="text-align: center; font-size: 1.7rem; font-weight: 600; color: #252525">MITRENDI</div>
                            <div style="text-align: center; font-size: .7rem; margin-top: -.5rem; letter-spacing: .52rem; padding-left: .52rem">WARDROBE</div>
                        </div>

                        <div style="margin-top: 3rem; text-align: left; font-size: 2rem; color: #474747;   padding-left: .8rem;">Hi ${cap_name}</div><br/>

                        <div style=" margin-top: -.7rem; font-size: .95rem; color: #474747;   padding-left: .7rem; text-align: left;">We have recieved a request to change your password. If this was not you, simply ignore this email</div>

                        <div style=" margin-top: 2rem; margin-bottom: .7rem;  padding-left: .7rem;  color: #474747; text-align: left; font-size: .95rem">Click below to change your password. This link expires in 15 minutes</div><br/> 

                        <div style="width: 100%; text-align: center">
                            <a href='http://localhost:3000/change_password/${modify_tk}'>
                                <button class="action_name" style="width: fit-content; padding: .6rem; padding-left: .9rem; padding-right: .9rem; margin-left: .5rem; margin-left: .5rem; color: white; background-color: #000055; border: 1px solid white; border-radius: 10px;" >
                                    CHANGE PASSWORD
                                </button>
                            </a>
                        </div>

                        <br/>
                        <br/>
                        <div style=" margin-top: 1rem; margin-bottom: .7rem;  padding-left: .7rem;  color: #111111; text-align: left; font-size: .95rem; font-weight: 600;">This is an automated email, kindly do not reply</div>
                    </div>
                </div>
            </body>
        </html>
    `


    return html
}





module.exports = reset_pass_email_gen
