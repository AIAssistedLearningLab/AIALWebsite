---
title: "AIAL Lab - Publications"
layout: gridlay
excerpt: "AIAL Lab -- Publications."
sitemap: false
permalink: /publications/
---


# Publications

## Group highlights

<!-- **At the end of this page, you can find the [full list of publications and patents](#full-list-of-publications)** -->

{% assign number_printed = 0 %}

{% assign publist = site.data.publist | sort: "year" | reverse %}
{% for publi in publist %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if publi.highlight %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-6 clearfix">
 <div class="well">
  <pubtit>{{ publi.title }}</pubtit>
  <!-- <img src="{{ '/assets/images/pubpic' | relative_url}}/{{ publi.image }}" class="img-responsive" width="33%" style="float: left" /> -->
  <!-- <p>{{ publi.description }}</p> -->
  <p><em>{{ publi.authors }}</em></p>
  <p><strong><a href="{{ publi.link.url }}">{{ publi.link.display }}</a></strong></p>
  <p class="text-danger"><strong> {{ publi.news1 }}</strong></p>
  <p> {{ publi.news2 }}</p>
 </div>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endif %}
{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}

<p> &nbsp; </p>

## Full List of publications

{% for publi in publist %}

  ({{publi.year}}) {{ publi.title }} <br />
  <em>{{ publi.authors }} </em><br /><a href="{{ publi.link.url }}">{{ publi.link.display }}</a>

{% endfor %}
