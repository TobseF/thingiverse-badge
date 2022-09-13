# 🎫 Thingiverse Badge
This is a [Thingiverse](https://www.thingiverse.com/)-Badge SVG graphic which user designs and makes.
The counter gets automatically updated by a [GitHub CI workflow](https://resources.github.com/ci-cd/).

![thingiverse-designs](https://raw.githubusercontent.com/TobseF/thingiverse-badge/master/thingiverse-designs.svg)
![thingiverse-makes](https://raw.githubusercontent.com/TobseF/thingiverse-badge/master/thingiverse-makes.svg)

## ⭐ Features
 ⭐ Customizable  
 ⭐ SVG graphic  
 ⭐ Always up to date  
 ⭐ Image hosted by GitHub  
 ⭐ Git based stats history  
 ⭐ No API key is needed

## 📖 How it works
This `update-badge-script.js` [Node.js](https://nodejs.org/en/) script reads 
the [Thingiverse API](https://www.thingiverse.com/developers/rest-api-reference)
and writes the game stats into an SVG template file (`thingiverse-makes-template.svg`).
If the generated badge is newer then the file in the repository, it
commits the new generated `thingiverse-makes.svg` to this GIT repository.
The pipeline gets triggered by a cron job, which automatically updates the image every midnight.

You can link the generated file by:  
https://raw.githubusercontent.com/{userName}/thingiverse-badge/master/thingiverse-makes.svg

## 🛠 Config
The script can be configured to generate a badge for any user:
* `userName`: Your username on BoardGameGeek.  
   Example url: https://www.thingiverse.com/topsee/ 
   `userName` = `topsee`
* `accessToken`: OAuth2 access token.  
   Check out the [Getting Started Guide](https://www.thingiverse.com/developers/getting-started) 
   to learn how to generate the token.  
   Set the `THINGI_ACCESS_TOKEN` in your project environments settings.
* `cron`: You can change the update time interval in the `.github/workflows/main.yml`:  
   On Line 6:  
   `- cron: '0 0 * * *'` (every day at midnight).
   Uses the [cron-job syntax](https://crontab.guru/every-midnight).
