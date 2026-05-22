# AWS Console Style Portfolio (Hugo)

This project is a static Hugo portfolio designed to feel like an AWS Console experience while presenting personal portfolio content.

## Theme and Assets

The website uses an AWS-console-inspired visual structure and your locally provided icon snapshot assets from:

- Console Home _ Console Home _ us-east-1_files/

SVG assets are copied to:

- static/assets/aws-icons/

## Project Structure

- config.toml: Hugo site configuration.
- data/portfolio.yaml: All profile and section content in one place.
- layouts/_default/baseof.html: Base HTML template.
- layouts/index.html: Main page layout and section mapping.
- static/css/console.css: AWS-inspired theme styles.
- static/js/app.js: Active section highlight logic.
- static/assets/aws-icons/: Local icon library used by service navigation.
- .gitlab-ci.yml: GitLab Pages pipeline.

## Local Development

1. Install Hugo extended version.
2. Run:

	hugo server -D

3. Open the local URL shown in terminal.

## Build for Production

Run:

hugo --minify

Generated site output is in public/.

## Edit Portfolio Content

Update content in data/portfolio.yaml.

Main customization points:
- profile account bar (name, phone, role, region).
- AWS service to portfolio section mapping in sidebar.
- all portfolio sections: about, summary, timeline, skills, certifications, IBM, TCS, awards, leadership, education, passion, contact.

## GitLab Pages Deployment

This repo includes .gitlab-ci.yml for Pages.

Steps:
1. Push repository to GitLab.
2. Ensure default branch is main or master.
3. Pipeline runs Hugo and publishes public/ as Pages artifact.
4. Open Deploy > Pages in GitLab to get your live URL.

## Next Customization Suggestions

- Swap sidebar icon filenames in data/portfolio.yaml to pick different local SVGs.
- Add a resume PDF download button in layouts/index.html.
- Connect custom domain in GitLab Pages settings.