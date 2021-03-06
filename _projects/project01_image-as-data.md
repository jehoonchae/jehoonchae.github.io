---
layout: archive
title: ""
type: "Work In Progress"
permalink: /projects/project01_image-as-data
excerpt: "Work In Progress (with [Seokyoung Min](https://sites.google.com/view/seokyoungmin/home?authuser=0) & Sang Yup Lee)"
---

## Image As Data: How Instagram photos reveal individual’s characteristics and personality

Authors: Seokyoung Min, Je Hoon Chae, Jonghyun Lee, & Sang Yup Lee

&nbsp;

### Abstract
---
People share their personal experiences and thoughts with other people through social media. Although previous research on social media has been focused mainly on the language use in text-based platforms such as Twitter and Facebook, few studies have been conducted on behavior in image-based platforms such as Instagram. In this study, we tried to quantify various topics in images that people share on Instagram, and to examine whether the characteristics of the images uploaded by each individual are distinguished from each other, and whether these characteristics are related to the individuals' personality. We collected 48,855 Instagram photos uploaded over the past two years from a total of 79 participants, along with the big 5 personality traits. To systematically quantify common topics that appear in Instagram platform, we collected an independent dataset of 78,536 Instagram photos by scraping random images using frequently used hashtags on Instagram, and tagged objects contained in each image using a computer vision object recognition algorithm. We then trained a latent Dirichlet allocation (LDA) topic model that regards each image as a document, and represented all images as a point in a common 50-dimensional topic space. To determine whether the Instagram photos of each participant have uniqueness that distinguished them from others, we calculated topic similarity between images. When comparing within-subject topic similarities and between-subject similarities, within-subject similarity was significantly higher than between-subject similarity, suggesting that characteristics of Instagram photos uploaded by each person can be distinguished from other people. Next, to see if participants with similar personalities upload images of similar topics, we conducted inter-subject representational similarity analysis (RSA). When comparing the personality similarity matrix representing similarities between the participants in the big 5 personality traits and the topic similarity matrix representing similarities in the topic space, a significant positive correlation was shown between these two matrices, suggesting that people with similar personalities upload images of similar topics on Instagram.

&nbsp;

### Keywords
---
social media, Instagram, image analysis, topic modeling, fingerprinting, inter-subject representational similarity analysis (RSA)  

&nbsp;

### Figures
---
![figure_01](/images/project_01/figure_01.png#center)
<p style="text-align:center; font-weight:bold;">Figure 1. Overall Scheme of the research</p>
&nbsp;

&nbsp;

![figure_02](/images/project_01/figure_02.png#center)
<p style="text-align:center; font-weight:bold;">Figure 2. Result of Idiosyncrasy Analysis</p>
&nbsp;

&nbsp;

![figure_03](/images/project_01/figure_03.png#center)
<p style="text-align:center; font-weight:bold;">Figure 3. Result of Fingerprinting Analysis</p>
&nbsp;

&nbsp;

![figure_04](/images/project_01/figure_04.png#center)
<p style="text-align:center; font-weight:bold;">Figure 4. Result of Inter-Subject Representational Similarity (RSA) Analysis</p>
