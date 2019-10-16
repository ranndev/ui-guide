import IAttrNames from '../models/attr-names';
import IGlobalConfiguration from '../models/global-configuration';

export default function createClassNamePrefixer(
  globalConfiguration: IGlobalConfiguration,
) {
  /**
   * Create a markers class name.
   */
  function prefixAttrName(
    type: 'markers',
    value: IAttrNames['markers'],
  ): string;

  /**
   * Create a highlight class name.
   */
  function prefixAttrName(
    type: 'elements',
    value: IAttrNames['elements'],
  ): string;

  /**
   * Implementation.
   */
  function prefixAttrName(
    type: keyof IAttrNames,
    value: IAttrNames['markers'] | IAttrNames['elements'],
  ): string {
    return globalConfiguration.attrPrefix + '-' + type + '-' + value;
  }

  return prefixAttrName;
}
