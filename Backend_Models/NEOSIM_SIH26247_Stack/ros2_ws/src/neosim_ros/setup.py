from setuptools import setup
package_name='neosim_ros'
setup(name=package_name,version='0.1.0',packages=[package_name],data_files=[('share/ament_index/resource_index/packages',['resource/neosim_ros']),('share/neosim_ros',['package.xml']),('share/neosim_ros/worlds',['worlds/neosim_training.sdf'])],install_requires=['setuptools'],zip_safe=True,entry_points={'console_scripts':['scenario_controller = neosim_ros.scenario_controller:main','telemetry_bridge = neosim_ros.telemetry_bridge:main']})
