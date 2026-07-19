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
