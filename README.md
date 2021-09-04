# gsl-parser

Parse GSL format ascii reports from https://rucsoundings.noaa.gov

```sh
yarn add gsl-parser
```

then parse away! 🎉

```ts
import parse from 'gsl-parser'

// fetch the ascii report from
// https://rucsoundings.noaa.gov/get_soundings.cgi
//
// documentation on parameters here:
// https://rucsoundings.noaa.gov/text_sounding_query_parameters.pdf

const data = parse(asciiReport)

console.log(data)
```

## Limitations

This parser is just tested with Op40 analyses at the moment. Other reports are untested. PRs welcome!