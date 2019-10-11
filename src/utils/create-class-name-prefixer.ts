import IClassNames from '../models/class-names';
import IGlobalConfiguration from '../models/global-configuration';

export default function createClassNamePrefixer(
  globalConfiguration: IGlobalConfiguration,
) {
  /**
   * Create a markers class name.
   */
  function prefixClassName(
    type: 'markers',
    value: IClassNames['markers'],
    withDotPrefix?: boolean,
  ): string;

  /**
   * Create a highlight class name.
   */
  function prefixClassName(
    type: 'elements',
    value: IClassNames['elements'],
    withDotPrefix?: boolean,
  ): string;

  /**
   * Implementation.
   */
  function prefixClassName(
    type: keyof IClassNames,
    value: IClassNames['markers'] | IClassNames['elements'],
    withDotPrefix: boolean = false,
  ): string {
    const className =
      globalConfiguration.classNamePrefix + '-' + type + '-' + value;
    return withDotPrefix ? '.' + className : className;
  }

  return prefixClassName;
}
