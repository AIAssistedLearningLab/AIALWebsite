# AI Assisted Learning Lab

This is the website of our lab at NCSU.

This website is powered by Jekyll and some Bootstrap, Bootwatch.

Our website is set up to be deployed under the virtual host provided by the university. However, this requires some extra physical labor that could be made simpler if we had access to GitHub Actions for a website repository (though would still require someone manually pulling the website). As we don’t currently, I will be doing it the slightly more labor-intensive way. 

The framework we use for our website is called Jekyll. Jekyll is a static-site generation tool written in Ruby that converts a collection of templated markdown, HTML, and YAML data files into a standard static HTML/CSS/JS website. We chose to do it this way because it makes it far simpler to update the site since you don’t need to know HTML, CSS, or JS.

After the github action runs and builds the website, you need to follow the instruction in [this document](https://docs.google.com/document/d/1_l2iml2VZ54BsF0gEdVki7_GFMKPm76mA5dPSKPTfjE/edit) to connect to the virtual host. Then you can follow the following instructions from your favorite bash terminal.

```
cd /mnt/coe/engrwww/csc/CSC.RESEARCH/aial
git pull
``` 

If for some reason you need to reclone the repo, you can use the following after you delete the contents of the `aial` folder (without deleting the `aial` folder)
```
git clone -b built https://github.ncsu.edu/AIAssistedLearningLab/AIAssistedLearningLab.github.ncsu.edu.git .
```
