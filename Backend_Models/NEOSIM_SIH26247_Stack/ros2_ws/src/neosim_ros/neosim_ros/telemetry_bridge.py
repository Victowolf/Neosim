import json
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class TelemetryBridge(Node):
    """Validates telemetry JSON from a simulator adapter and republishes it for a backend bridge."""
    def __init__(self):
        super().__init__('neosim_telemetry_bridge')
        self.sub=self.create_subscription(String,'/neosim/telemetry_in',self.on_telemetry,20)
        self.pub=self.create_publisher(String,'/neosim/telemetry_out',20)
    def on_telemetry(self,msg):
        try:data=json.loads(msg.data)
        except json.JSONDecodeError:
            self.get_logger().warning('Discarded invalid telemetry JSON'); return
        required={'trainee_id','session_id'}
        if not required.issubset(data):
            self.get_logger().warning('Telemetry needs trainee_id and session_id'); return
        out=String(); out.data=json.dumps(data); self.pub.publish(out)
def main(args=None):
    rclpy.init(args=args); node=TelemetryBridge()
    try:rclpy.spin(node)
    except KeyboardInterrupt:pass
    finally:node.destroy_node(); rclpy.shutdown()
if __name__=='__main__':main()
