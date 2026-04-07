#!/usr/bin/env bash
# Download all property photos from h2owatermark.com
set -e
cd "$(dirname "$0")/.."

mkdir -p public/images/properties public/images/sales public/images/developments

BASE="https://h2owatermark.com"

# ----- RENTALS (slug → URL) -----
declare -A RENTALS=(
  [watermark-3104]="photo/1620853607-5.jpg"
  [watermark-1604]="photo/66f30d4cc02391eceace460a54796a28-8.jpg"
  [kahului]="photo/1724457137-0.png"
  [central-ala-moana-3401]="photo/1678483179-2.jpg"
  [watermark-1205]="photo/1691542618-1.jpg"
  [symphony-3409]="photo/1631842281-12.jpg"
  [kalalau-251]="photo/857dd2c8d370191307d02648f50af823-DMW_7624-Edit.jpg"
  [watermark-1204]="photo/1673851300-2.jpg"
  [watermark-202]="photo/1622674808-0.jpg"
  [mawaena-kai-e12]="photo/1671744348-0.jpeg"
  [eaton-2614]="photo/1647299641-0.jpg"
  [moana-pacific-3401]="photo/f9b9c75600240f71ba73b96506cfe869-5.jpg"
  [sky-ala-moana-1611]="photo/1706745797-12.jpg"
  [marina-front-9000]="photo/6095d67d773cbf65b3b164db6f55e4e9-DMW_4344-Edit.jpg"
  [yacht-harbor-towers]="photo/1673850479-11.jpg"
  [hawaiki-tower-2805]="photo/752880cb21d71145904ec8e2ea8f6618-DMW_6038-Edit.jpg"
  [waikiki-sunset-2102]="photo/1614302230-9.jpg"
  [king-kalani-301]="photo/ed96393094664346c2ec5a555c83d6e2-DMW_9416-Edit-Edit.jpg"
  [ohua-1905]="photo/1673901115-2.jpg"
  [hokuahiahi-318]="photo/1694821978-2.jpeg"
  [watermark-1905]="photo/1673901297-2.jpg"
  [watermark-1105]="photo/1621061198-0.jpg"
  [puuikena-825]="photo/867c81c3d9b78e7460f70a08447ac329-DMW_1463-Edit.jpg"
  [poipu]="photo/fd066b6f815c12571ae89656addc1bc9-DMW_1876-Edit.jpg"
  [keokea-6266]="photo/1697246670-3.jpg"
  [watermark-1005]="photo/c4f3cff1a5bbb9334d5ca48e87ade6f9-1.jpg"
  [watermark-1204b]="photo/1663653943-2.png"
  [watermark-1001]="photo/1e85bd4eca2856a3d9a207385e2df17b-16.jpg"
  [watermark-704]="photo/c5441962f8a72b6764cb9211ad2abe01-201509812_01.jpg"
  [central-ala-moana-2908]="photo/1641408589-5.jpg"
  [esplanade-26g]="photo/1672431183-1.png"
  [pacifica-3707]="photo/f09e9be5fa52a866780a0f299d419268-a25.jpg"
  [lunalilo-23d]="photo/1686794112-3.jpg"
  [waikiki-landmark]="photo/1657853104-2.jpg"
  [halekauwila-3209]="photo/10332c423b651006c950e07d00c58691-56.jpg"
  [kaiopua-1200]="photo/4dfd808a122fb4fe2e87309b8b0f97d4-Resized_1.jpg"
  [kalihi-1915]="photo/1654742451-0.jpg"
  [canterbury-36e]="photo/1698184954-0.png"
  [mauna-luan]="photo/1644297518-0.jpg"
  [ilikai-marina-1284]="photo/1673901550-15.jpg"
  [hoomaka-1039]="photo/1642550064-0.jpg"
  [park-pearlridge-c1808]="photo/1667271959-16.jpg"
  [colony-peninsula-6424]="photo/1683338264-1.jpg"
  [one-archer-lane]="photo/1649797611-7.jpg"
  [colony-peninsula-2]="photo/1647299146-2.jpg"
  [royal-capitol-2701]="photo/1683249416-1.jpg"
  [iolani-court-3706]="photo/1663707787-16.jpg"
  [koolani-1111]="photo/1642550294-1.jpg"
  [burke-1687]="photo/1673852314-1.jpg"
  [mahuli-502]="photo/1647298732-11.jpg"
  [pepeekeo-520b]="photo/388c0bb7239c9a3ec42bd82f24ce2ff1-2.jpg"
  [hale-o-pumehana-603]="photo/ade2cf9a3a3001254e56ba01fb9db153-DMW_9511-Edit.jpg"
)

# ----- SALES (slug → URL) -----
declare -A SALES=(
  [watermark-sale-1]="photo/1724458121-10.jpg"
  [watermark-sale-2]="photo/1691268617-8.jpg"
  [watermark-sale-2802]="photo/1714786503-10.jpg"
  [upolo-6278]="photo/f3a9be1dbdaca3578a28eb80b3aa2db9-image (1).jpg"
  [nauru-tower]="photo/1f5c83d2ebdab23d8bf203d99c586836-p2499641737-6.jpg"
  [kaluanui-1147]="photo/804a9333678f6f9d06dd6a240db70fd4-IMG_48291.jpg"
  [ritz-carlton-studio]="photo/efed54505a03b733cd39eb97d7271897-3.jpg"
  [hawaii-kai-6651]="photo/7b051c2bc81c3d8a67092372302162cf-DMW_9986-Edit.jpg"
  [kalalau-sale-251]="photo/e8c928916f1ff7fd8f19f5429b364518-DMW_7643-Edit.jpg"
  [watermark-sale-1488]="photo/7e88ad00035cf1b2854a90fc77f28188-Living room.jpg"
  [watermark-sale-1298]="photo/a3ea53f6ff4775a6f59ac94d9bdd12b2-DMW_7219-Edit.jpg"
  [mawaena-kai-sale]="photo/1647503837-3.jpg"
  [eaton-sale]="photo/1615066507-4.jpg"
)

download_set() {
  local -n arr=$1
  local dest=$2
  local count=0 fail=0
  for slug in "${!arr[@]}"; do
    url="$BASE/${arr[$slug]}"
    ext="${arr[$slug]##*.}"
    out="$dest/$slug.$ext"
    if [ -f "$out" ] && [ -s "$out" ]; then
      count=$((count+1))
      continue
    fi
    if curl -sf -o "$out" "$url"; then
      count=$((count+1))
    else
      echo "FAIL: $slug ← $url"
      rm -f "$out"
      fail=$((fail+1))
    fi
  done
  echo "$dest: $count downloaded, $fail failed"
}

echo "Downloading rentals..."
download_set RENTALS public/images/properties

echo "Downloading sales..."
download_set SALES public/images/sales

echo "Done."
