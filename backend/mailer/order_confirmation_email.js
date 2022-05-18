



const order_confirmation_email_creator = (name, ID, item_name_array, area, location) => {

    const layItems = () => {
        const itemList = []

        item_name_array.forEach(item => itemList.push(`<div style=" width: fit-content; background-color: #efefef; margin-top: .5rem; margin-left: .7rem; padding-left: .5rem; padding-right: .8rem; padding-top: .2rem; padding-bottom: .2rem; border-radius: 10px; text-align: left;"><span style="color: #252525; font-size: .85rem; font-weight: 500;">${item[0].toUpperCase()}</span></div>`
        ))

        return itemList
    }

    const cap_name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    
    const html = 
    `<html>
    <body style="margin: auto; padding-top: 2rem; padding-bottom: 2rem; display: flex; justify-content: center; align-items: center; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; background-color: #eeeeee;">
        <div style="margin: 0; margin-left: auto; margin-right: auto; display: flex; justify-content: center; align-items: center; background-color: white; width: fit-content; padding: 3rem; padding-left: .2rem; padding-right: .2rem; border-radius: 10px;">
            <div style="margin: auto;">

                <div>
                    <div style="text-align: center; font-size: 1.7rem; font-weight: 600; color: #252525">MITRENDI</div>
                    <div style="text-align: center; font-size: .7rem; margin-top: -.5rem; letter-spacing: .52rem; padding-left: .52rem">WARDROBE</div>
                </div>

                <div style="margin-top: 2rem; text-align: left; font-size: 1.3rem; color: #474747;   padding-left: .7rem;">Hi ${cap_name}</div>

                <div style=" margin-top: -.7rem; font-size: 1rem; color: #000000;   padding-left: .7rem; text-align: left;">Thank you for your order!</div><br/>
                <div style=" margin-top: -.7rem; font-size: .95rem; color: #474747;   padding-left: .7rem; text-align: left;">The following item(s) have been dispatched to ${area} area, ${location} location via pick-up mtaani delivery.</div><br/>

                ${layItems()}


                <br/>
                <div style=" margin-top: -.7rem; font-size: 1rem; color: #000000;   padding-left: .7rem; text-align: left;">order ID: ${ID}</div><br/>

                <div style=" margin-top: 1rem; margin-bottom: .7rem;  padding-left: .7rem;  color: #474747; text-align: left; font-size: .95rem">For any inquiries, please write an email to admin@mitrendi.com.</div>

                <div style=" margin-top: 1rem; margin-bottom: .7rem;  padding-left: .7rem;  color: #111111; text-align: left; font-size: .95rem; font-weight: 600;">This is an automated email, kindly do not reply</div>
            </div>
        </div>
    </body>
    </html>`


     return html
}

module.exports = order_confirmation_email_creator