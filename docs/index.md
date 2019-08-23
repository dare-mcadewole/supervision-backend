# ![](https://super-vision.netlify.com/favicon.ico)
# SuperVision API Documentation v2.0
----

>Anti-Vandalism Supervisory Panel  
(Remote Surveillance with System control)  

## API Endpoints
***
**The following information are *very important* :**
>**Base URL**: https://super-vision.herokuapp.com/api  
**Authorization Header**: `Bearer rge2ulWJgH4ghCb1ZITkv9mwjtb381wz`  
**Content-Type**: `application/json` (Use `application/x-www-form-urlencoded` for the Video endpoint)  
**zone_id**: `1`, `2` or `3`  

>
-- If **Authorization** header is absent, server will respond with HTTP status 403 (Forbidden)  
-- If **Content-Type** is absent, server will respond with HTTP status 503  
-- If **zone_id** is absent or any value other than 1, 2 or 3, server will respond with a 'INVALID_ID' message  

| Action | Route | Method | Request Data | Response | Note(s) |
| --- | --- | --- | --- | --- | --- |
|Update sensor data | `zone/:zone_id` | `PUT` | ```{ sensor: 'PIR', state: true }``` | Same as request data (if successful) | `sensor` can be **PIR**, **DOPPLER** or **INTRUSION** and `state` can be **`true`** or **`false`**
|Send video | `zone/:zone_id/video` | `POST` | ```{ frame: [image.jpg] }``` | ```{ msg: 'SUCCESS' }``` | None |
| Get Control State | `zone/:zone_id/control` | `GET` | None | ```{ ALARM: true, PROTECT_ZONE: false, OVERRIDE: true, AUTO_PROTECT: false }``` | None |
| Get Alarm State | `zone/:zone_id/alarm` | `GET` | None | ```{ state: true }``` | `state` specifies if the sound alarm button has been pressed, `true` if so and vice-versa |
| Update Alarm State | `zone/:zone_id/alarm` | `PUT` | ```{ control: 'OVERRIDE', state: false }``` | Same as request (if successful) | Use this to reset the alarm state |


## Author(s)
----  

- Dare McAdewole
>Software Developer  [@dare_mcadewole](https://twitter.com/@dare_mcadewole)  [Gmail](mailto:dare.dev.adewole@gmail.com)
