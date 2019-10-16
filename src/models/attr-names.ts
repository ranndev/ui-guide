export default interface IAttrNames {
  markers:
    | 'clickable'
    | 'non-positioned'
    | 'force-clickable'
    | 'highlighting'
    | 'show';
  elements: 'backdrop' | 'box' | 'target' | 'popup';
}
