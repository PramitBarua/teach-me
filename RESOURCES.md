# Resources

## Primary

| ID | Title | URL | Notes |
|----|-------|-----|-------|
| R01 | Adrian Cantrill – AWS SAA-C03 Course | https://learn.cantrill.io/p/aws-certified-solutions-architect-associate | Primary course; notes in `../cantrill/` |
| R02 | AWS IAM Documentation | https://docs.aws.amazon.com/IAM/latest/UserGuide/ | Official reference for IAM concepts |
| R03 | AWS Organizations Documentation | https://docs.aws.amazon.com/organizations/latest/userguide/ | Official reference for Orgs and SCPs |
| R04 | AWS CloudTrail Documentation | https://docs.aws.amazon.com/awscloudtrail/latest/userguide/ | Official reference for CloudTrail |
| R05 | AWS CloudWatch Logs Documentation | https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/ | Official reference for CloudWatch Logs |
| R06 | AWS Control Tower Documentation | https://docs.aws.amazon.com/controltower/latest/userguide/ | Official reference for Control Tower |
| R07 | SAA-C03 Exam Guide | https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf | Official exam guide – defines scope |
| R08 | Amazon S3 Documentation | https://docs.aws.amazon.com/AmazonS3/latest/userguide/ | Official reference for all S3 features |
| R09 | AWS KMS Documentation | https://docs.aws.amazon.com/kms/latest/developerguide/ | Official reference for KMS keys, DEKs, policies |
| R10 | S3 Storage Classes Overview | https://aws.amazon.com/s3/storage-classes/ | Comparison table of all S3 storage classes |
| R11 | Amazon VPC User Guide | https://docs.aws.amazon.com/vpc/latest/userguide/ | Official reference for all VPC concepts |
| R12 | AWS NAT Gateway Documentation | https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html | NAT Gateway setup, HA design, limits |
| R13 | VPC Network ACLs Documentation | https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html | Stateless subnet-level firewall reference |
| R14 | VPC Security Groups Documentation | https://docs.aws.amazon.com/vpc/latest/userguide/security-groups.html | Stateful ENI-level firewall reference |
| R15 | Amazon RDS User Guide | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html | Official reference for RDS (non-Aurora engines) |
| R16 | Amazon Aurora User Guide | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html | Official reference for Aurora |
| R17 | RDS Multi-AZ Deployments | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html | Multi-AZ instance vs cluster deployment reference |
| R18 | RDS Automated Backups | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html | Backups, snapshots, and point-in-time restore |
| R19 | RDS Read Replicas | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html | Read replica architecture and use cases |
| R20 | Security in Amazon RDS | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.html | Encryption in transit/at rest, IAM authentication |
| R21 | Amazon RDS Custom | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-custom.html | RDS Custom architecture and shared responsibility |
| R22 | Using Aurora Serverless | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html | ACUs, scaling behaviour, use cases |
| R23 | Using Amazon Aurora Global Database | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html | Cross-Region replication, DR, and global reads |
| R24 | Amazon RDS Proxy | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html | Connection pooling, multiplexing, failover abstraction |
| R25 | AWS Database Migration Service User Guide | https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html | DMS architecture, task types, and Schema Conversion Tool |
| R26 | Amazon EFS User Guide | https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html | Official reference for EFS architecture, mount targets, performance/throughput modes |
| R27 | AWS Backup Developer Guide | https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html | Official reference for backup plans, vaults, and Vault Lock |
| R28 | Amazon EC2 User Guide | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html | Official reference for EC2 concepts and instance lifecycle |
| R29 | Amazon EC2 Instance Types | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html | Instance family/type reference |
| R30 | AWS Nitro System | https://aws.amazon.com/ec2/nitro/ | Nitro hypervisor, Nitro Cards, Nitro Security Chip overview |
| R31 | Amazon EBS User Guide | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html | Official reference for EBS |
| R32 | EBS Volume Types | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html | gp2/gp3/io1/io2/st1/sc1 comparison |
| R33 | Amazon EBS Snapshots | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSSnapshots.html | Snapshot mechanics and restore |
| R34 | Fast Snapshot Restore | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-fast-snapshot-restore.html | FSR reference |
| R35 | Amazon EBS Encryption | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html | Encryption at rest for EBS volumes and snapshots |
| R36 | Amazon EC2 Instance Store | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html | Ephemeral local NVMe storage reference |
| R37 | Elastic Network Interfaces | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html | ENI attachment, multiple IPs, cross-AZ ENIs |
| R38 | EC2 Instance IP Addressing | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html | Private/public IP and DNS behavior |
| R39 | Amazon Machine Images (AMI) | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html | AMI lifecycle, sharing, and copying |
| R40 | EC2 On-Demand Instances | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html | On-Demand pricing model |
| R41 | EC2 Reserved Instances | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html | RI attributes, terms, payment options |
| R42 | EC2 Spot Instances | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html | Spot pricing, interruption behavior |
| R43 | AWS Savings Plans | https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html | Compute Savings Plans vs EC2 Instance Savings Plans |
| R44 | EC2 Dedicated Hosts | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html | Dedicated Hosts vs Dedicated Instances |
| R45 | EC2 Status Checks | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html | System vs instance status checks |
| R46 | EC2 Auto Recovery | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html | CloudWatch alarm-triggered instance recovery |
| R47 | Amazon EC2 Auto Scaling | https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html | Horizontal scaling reference |
| R48 | EC2 Instance Metadata Service (IMDS) | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html | IMDSv1 vs IMDSv2 reference |
| R49 | Amazon ECS Developer Guide | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html | Official reference for ECS concepts |
| R50 | Amazon ECS Task Definitions | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html | Container definitions vs. task definitions |
| R51 | Amazon ECS Clusters | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html | EC2 vs Fargate capacity, capacity providers |
| R52 | Amazon ECS Task IAM Role | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html | Task role — app-level AWS access from inside a container |
| R53 | Amazon ECS Task Execution IAM Role | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html | Execution role — image pull, log delivery, before app starts |
| R54 | AWS Fargate | https://aws.amazon.com/fargate/ | Serverless container compute overview |
| R55 | Amazon ECR User Guide | https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html | Registries, repositories, images, tags |
| R56 | ECR Image Scanning | https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html | Basic vs enhanced (Amazon Inspector) scanning |
| R57 | Amazon EKS User Guide | https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html | EKS control plane, clusters, architecture |
| R58 | Amazon EKS Nodes | https://docs.aws.amazon.com/eks/latest/userguide/eks-compute.html | Self-managed nodes, managed node groups, Fargate |
| R59 | Amazon EC2 User Data | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html | Bootstrapping mechanics, 16 KB limit, once-at-launch execution |
| R60 | CloudFormation cfn-init Helper Script | https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/cfn-init.html | Desired-state config via AWS::CloudFormation::Init |
| R61 | CloudFormation CreationPolicy Attribute | https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-creationpolicy.html | Resource creation signaling via cfn-signal |
| R62 | IAM Roles for Amazon EC2 | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html | Instance role vs. instance profile architecture |
| R63 | AWS Systems Manager Parameter Store | https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html | Parameter types, hierarchy, KMS encryption |
| R64 | Installing the CloudWatch Agent | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-EC2-Instance.html | Agent install, IAM permissions, config sources |
| R65 | EC2 Placement Groups | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html | Cluster/spread/partition strategies and limits |
| R66 | EC2 Enhanced Networking | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking.html | SR-IOV, ENA, bandwidth/PPS/latency benefits |
| R67 | Amazon EBS-Optimized Instances | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html | Dedicated EBS I/O network capacity |
| R68 | Amazon Route 53 Concepts | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html | Hosted zones, records, name servers terminology |
| R69 | Working with Public Hosted Zones | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/AboutHZWorkingWith.html | Public zone architecture, walking the tree |
| R70 | Working with Private Hosted Zones | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-private.html | VPC association, split-view DNS |
| R71 | Choosing Between Alias and Non-Alias Records | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html | CNAME vs. alias, zone apex restriction |
| R72 | Choosing a Routing Policy | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html | Overview of all Route 53 routing policy types |
| R73 | How Route 53 Checks the Health of Your Resources | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/welcome-health-checks.html | Health check types, 18% healthy threshold |
| R74 | Geoproximity Routing | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-geoproximity.html | Distance-based routing with bias |
| R75 | Configuring DNSSEC Signing in Amazon Route 53 | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-configuring-dnssec.html | KSK/ZSK architecture, chain of trust, DS records |
| R76 | How Elastic Load Balancing Works | https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html | ELB nodes, cross-zone balancing, subnet requirements |
| R77 | Application Load Balancers | https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html | ALB architecture, subnets, listeners/rules |
| R78 | What Is a Network Load Balancer? | https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html | NLB architecture, TLS listeners, static IPs |
| R79 | What Is a Gateway Load Balancer? | https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html | GWLB architecture, Geneve encapsulation |
| R80 | Sticky Sessions for Your Application Load Balancer | https://docs.aws.amazon.com/elasticloadbalancing/latest/application/sticky-sessions.html | Duration-based vs. application-based cookies |
| R81 | Auto Scaling Launch Templates | https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html | Versioning, mixed instances, current recommended approach |
| R82 | Auto Scaling Launch Configurations | https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-configurations.html | Legacy; deprecated for new accounts since Oct 2024 |
| R83 | Auto Scaling Groups | https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html | Min/desired/max, AZ balancing |
| R84 | Dynamic Scaling for Amazon EC2 Auto Scaling | https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html | Simple/step/target tracking overview |
| R85 | Target Tracking Scaling Policies | https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html | Supported metrics, recommended default |
| R86 | Amazon EC2 Auto Scaling Lifecycle Hooks | https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html | Pending/terminating wait states, EventBridge/SNS |
| R87 | Health Checks for Instances in an Auto Scaling Group | https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html | EC2 vs. ELB vs. custom checks, grace period |
| R88 | Implementing Microservices on AWS (whitepaper) | https://docs.aws.amazon.com/whitepapers/latest/microservices-on-aws/microservices-on-aws.html | Monolith-to-microservices architectural evolution |
| R89 | How Amazon SQS Works | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-how-it-works.html | Queue decoupling mechanics overview |
| R90 | What Is Event-Driven Architecture? | https://aws.amazon.com/what-is/eda/ | Producers, routers, consumers pattern overview |
| R91 | Configuring AWS Lambda Functions | https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html | Runtimes, handlers, configuration basics |
| R92 | Configure Lambda Function Memory | https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html | Memory-to-vCPU scaling |
| R93 | Giving Lambda Functions Access to Resources in a VPC | https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html | VPC networking, ENI model, cold-start implications |
| R94 | Managing Permissions in AWS Lambda | https://docs.aws.amazon.com/lambda/latest/dg/lambda-permissions.html | Execution role vs. resource-based policy |
| R95 | Understanding Lambda Function Invocation Methods | https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html | Sync/async/event source mapping invocation models |
| R96 | Manage Lambda Function Versions | https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html | Versions and aliases |
| R97 | Configuring Provisioned Concurrency for a Function | https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html | Eliminating cold starts |
| R98 | What Is Amazon EventBridge? | https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html | Event buses, rules, targets |
| R99 | EventBridge Is the Evolution of Amazon CloudWatch Events | https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cwe-now-eb.html | What changed (and didn't) in the CloudWatch Events → EventBridge rename |
| R100 | What Is Serverless Development? | https://docs.aws.amazon.com/serverless/latest/devguide/welcome.html | Serverless architecture overview |
| R101 | Amazon Cognito Identity Pools | https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html | Temporary AWS credentials for authenticated/unauthenticated users |
| R102 | What Is Amazon SNS? | https://docs.aws.amazon.com/sns/latest/dg/welcome.html | Pub/sub topics and subscriptions |
| R103 | Common Amazon SNS Scenarios (Fanout) | https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html | Fan-out pattern to multiple SQS queues/Lambda |
| R104 | What Is AWS Step Functions? | https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html | State machines for workflow orchestration |
| R105 | Choosing a Workflow Type (Step Functions) | https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html | Standard vs. Express workflows |
| R106 | Choose Between REST APIs and HTTP APIs | https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html | API Gateway product type comparison |
| R107 | Cache Settings for REST APIs | https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html | API Gateway response caching |
| R108 | What Is Amazon SQS? | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html | SQS product overview |
| R109 | Amazon SQS Visibility Timeout | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html | In-flight message handling |
| R110 | Amazon SQS FIFO Queues | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html | Ordering and exactly-once processing |
| R111 | High Throughput for FIFO Queues | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/high-throughput-fifo.html | Now-GA high-throughput mode |
| R112 | Amazon SQS Delay Queues | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html | Queue-level delivery delay |
| R113 | Amazon SQS Message Timers | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-timers.html | Per-message delay |
| R114 | Using Dead-Letter Queues in Amazon SQS | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html | Redrive policy, maxReceiveCount |
| R115 | Setting Up DLQ Retention | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/setting-up-dead-letter-queue-retention.html | DLQ retention configuration |
| R116 | What Is Amazon Kinesis Data Streams? | https://docs.aws.amazon.com/streams/latest/dev/introduction.html | Real-time ingestion overview |
| R117 | Kinesis Data Streams Terminology and Concepts | https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html | Shards, partition keys, sequence numbers |
| R118 | What Is Amazon Data Firehose? | https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html | Renamed from Kinesis Data Firehose (Feb 2024); buffered delivery |
| R119 | Send Data to a Firehose Stream | https://docs.aws.amazon.com/firehose/latest/dev/basic-write.html | Producer integration |
| R120 | What Is Amazon Managed Service for Apache Flink? | https://docs.aws.amazon.com/managed-flink/latest/java/what-is.html | Renamed from Kinesis Data Analytics (Aug 2023) |
| R121 | Kinesis Data Analytics for SQL Applications Discontinuation | https://docs.aws.amazon.com/kinesisanalytics/latest/dev/discontinuation.html | SQL-only variant retired Jan 27, 2026 |
| R122 | What Is Amazon Kinesis Video Streams? | https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/what-is-kinesis-video.html | Streaming video/time-series media ingestion |
| R123 | Kinesis Video Streams: How It Works | https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-it-works.html | Producer/consumer architecture |
| R124 | What Is Amazon Cognito? | https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html | Cognito product overview |
| R125 | Amazon Cognito User Pools | https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html | Authentication and user directories |
| R126 | What Is AWS Glue? | https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html | Managed ETL overview |
| R127 | Data Discovery and Cataloging in AWS Glue | https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html | Crawlers and the Glue Data Catalog |
| R128 | What Is Amazon MQ? | https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/welcome.html | Managed ActiveMQ/RabbitMQ overview |
| R129 | Using Amazon MQ for RabbitMQ | https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/working-with-rabbitmq.html | RabbitMQ engine support (added after course recording) |
| R130 | What Is Amazon AppFlow? | https://docs.aws.amazon.com/appflow/latest/userguide/what-is-appflow.html | No-code SaaS-to-AWS data integration |
| R131 | Amazon AppFlow Flows | https://docs.aws.amazon.com/appflow/latest/userguide/flows.html | Flow configuration and triggers |
| R132 | What Is Amazon CloudFront? | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html | CDN overview |
| R133 | How CloudFront Delivers Content | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html | Cache hit/miss, origin fetch flow |
| R134 | Cache Behavior Settings | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistValuesCacheBehavior.html | Distribution vs. behavior-level configuration |
| R135 | Manage How Long Content Stays in the Cache (Expiration) | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html | TTL, min/max clamping, Cache-Control headers |
| R136 | Invalidate Files to Remove Content | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html | Invalidation paths, pricing |
| R137 | What Is AWS Certificate Manager? | https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html | ACM overview, generate vs. import |
| R138 | Requirements for Using SSL/TLS Certificates with CloudFront | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html | us-east-1 requirement, viewer/origin protocols |
| R139 | Restrict Access to an Amazon S3 Origin | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html | OAC (current) vs. OAI (legacy) |
| R140 | Serve Private Content with Signed URLs and Signed Cookies | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html | Private behavior architecture |
| R141 | Decide to Use Signed URLs or Signed Cookies | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-choosing-signed-urls-cookies.html | One object vs. many objects |
| R142 | Differences Between CloudFront Functions and Lambda@Edge | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html | Lightweight viewer-side vs. full edge compute |
| R143 | Customize at the Edge with Lambda@Edge | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html | Four hook points, runtime limitations |
| R144 | What Is AWS Global Accelerator? | https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html | Anycast IPs, AWS global network |
| R145 | Add Custom Headers to Origin Requests | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/add-origin-custom-headers.html | Securing custom (non-S3) origins |
| R146 | Logging IP Traffic Using VPC Flow Logs | https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html | Flow log architecture, destinations |
| R147 | Flow Log Records | https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html | Record fields, accept/reject fields |
| R148 | Enable Outbound IPv6 Traffic Using an Egress-Only Internet Gateway | https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html | IPv6-only, NAT-equivalent outbound-only gateway |
| R149 | Gateway Endpoints | https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html | S3/DynamoDB private access, prefix lists |
| R150 | Gateway Endpoints for Amazon S3 | https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html | S3-specific gateway endpoint detail, now IPv6-capable |
| R151 | Configure an Interface Endpoint | https://docs.aws.amazon.com/vpc/latest/privatelink/interface-endpoints.html | AZ-scoped ENIs, DNS names |
| R152 | Connect Your VPC to Services Using AWS PrivateLink | https://docs.aws.amazon.com/vpc/latest/userguide/endpoint-services-overview.html | PrivateLink underlying mechanism |
| R153 | What Is VPC Peering? | https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html | Peering overview, non-transitive |
| R154 | How VPC Peering Connections Work | https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html | Route tables, CIDR overlap restriction |
