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

## Example output

This project is 100% Typescript, which helps a lot! However, you can also [check out the test fixtures](test/01/expected.json).

## Limitations

This parser is just tested with Op40 analyses at the moment. Other reports are untested. PRs welcome!