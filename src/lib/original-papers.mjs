/** Board-hosted links listed in WBJEEB's old-question-paper index.
 * References only: do not bundle private scans or promote scoring eligibility.
 */
const root = 'https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/';
export const paperIndexUrl = 'https://wbjeeb.nic.in/jelet-old-question-papers/';
const paths = {
  2017: '2023/11/2023111594.pdf',
  2018: '2023/11/2023111538-1.pdf',
  2019: '2023/11/2023111582-1.pdf',
  2021: '2023/11/2023111536-1.pdf',
  2022: '2023/11/2023111591-3.pdf',
  2023: '2023/11/2023111575-2.pdf',
  2024: '2024/12/2024120234.pdf',
  2025: '2025/12/202512161802442791.pdf',
};
export function originalPaperUrl(year) {
  return Object.hasOwn(paths, year) ? root + paths[year] : null;
}
