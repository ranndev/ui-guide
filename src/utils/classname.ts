import IConfiguration from '../models/configuration';

export default function classname(
  defaults: IConfiguration,
  name: keyof IConfiguration['classes'],
) {
  return defaults.classNamePrefix + '-' + defaults.classes[name];
}
