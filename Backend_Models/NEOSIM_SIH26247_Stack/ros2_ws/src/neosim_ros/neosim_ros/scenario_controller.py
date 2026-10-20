import json
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class ScenarioController(Node):
    """Publishes high-level simulation controls; a version-specific SITL adapter must consume them."""
    def __init__(self):
        super().__init__('neosim_scenario_controller')
        self.pub=self.create_publisher(String,'/neosim/simulation_command',10)
        self.sub=self.create_subscription(String,'/neosim/operator_command',self.on_command,10)
        self.get_logger().info('Ready. Publish JSON to /neosim/operator_command: {"action":"start","scenario":"basic-navigation","drone_count":3}')
    def on_command(self,msg):
        try: data=json.loads(msg.data)
        except json.JSONDecodeError:
            self.get_logger().error('Expected a JSON object'); return
        action=data.get('action')
        allowed={'start','pause','resume','stop','scenario'}
        if action not in allowed:
            self.get_logger().warning(f'Unsupported action: {action}'); return
        out={"action":action,"scenario":str(data.get('scenario','basic-navigation')),"drone_count":max(1,min(12,int(data.get('drone_count',1)))),"source":"neosim_ros","simulation_only":True}
        msg_out=String(); msg_out.data=json.dumps(out); self.pub.publish(msg_out)
        self.get_logger().info(f'Published simulation command: {action}')
def main(args=None):
    rclpy.init(args=args); node=ScenarioController()
    try:rclpy.spin(node)
    except KeyboardInterrupt:pass
    finally:node.destroy_node(); rclpy.shutdown()
if __name__=='__main__':main()
