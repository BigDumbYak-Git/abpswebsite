const markdownIt = require("markdown-it");
const md = new markdownIt({ html: true, breaks: true, linkify: true });

module.exports = function(eleventyConfig) {

  // Static passthrough
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/bingsiteauth.xml");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  // Filters
  eleventyConfig.addFilter("markdown", content =>
    content ? md.render(String(content)) : ""
  );
  eleventyConfig.addFilter("limit", (arr, n) =>
    (arr || []).slice(0, n)
  );
  eleventyConfig.addFilter("truncate", (str, n) => {
    if (!str) return "";
    const plain = String(str).replace(/<[^>]+>/g, "");
    return plain.length > n
      ? plain.slice(0, n).replace(/\s+\S*$/, "") + "\u2026"
      : plain;
  });
  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    try { return new URL(path, base).href; } catch { return path; }
  });
  eleventyConfig.addFilter("formatDate", dateVal => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    return isNaN(d) ? String(dateVal) : d.toLocaleDateString("en-CA", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
    });
  });

  return {
    dir: {
      input:    "src",
      output:   "_site",
      includes: "_includes",
      data:     "_data"
    },
    templateFormats:        ["njk", "md", "html"],
    htmlTemplateEngine:     "njk",
    markdownTemplateEngine: "njk"
  };
};
