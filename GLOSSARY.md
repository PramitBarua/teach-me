# Glossary

## IAM

| Term | Definition |
|------|-----------|
| **Principal** | An entity (human, application, or service) that makes a request to AWS |
| **IAM User** | An identity for long-term access; represents one specific person or application |
| **IAM Group** | A container for IAM users; policies attached to a group apply to all members |
| **IAM Role** | A short-term identity assumed by trusted principals; not tied to one person |
| **IAM Policy** | A JSON document defining what actions are allowed or denied on which resources |
| **Managed Policy** | A standalone IAM policy that can be attached to multiple identities |
| **Inline Policy** | A policy embedded directly in a single identity; not reusable |
| **Trust Policy** | Part of a role definition; specifies which principals may assume the role |
| **Permission Policy** | Part of a role definition; specifies what the role can do |
| **ARN** | Amazon Resource Name — a globally unique identifier for any AWS resource |
| **Explicit Deny** | A policy statement that directly denies an action; overrides any allow |
| **Explicit Allow** | A policy statement that directly permits an action |
| **Implicit Deny** | The default state — everything is denied unless explicitly allowed |
| **Service-linked Role** | An IAM role pre-defined by an AWS service for its own use |
| **PassRole** | The ability to assign an existing role to an AWS service without being able to create or edit roles |

## Organizations

| Term | Definition |
|------|-----------|
| **AWS Organization** | A grouping of AWS accounts under a single management account |
| **Management Account** | The master account that creates and manages the organization; cannot be restricted by SCPs |
| **Member Account** | Any account that belongs to an organization other than the management account |
| **Org Root** | The top-level container in an AWS Organization hierarchy |
| **Organizational Unit (OU)** | A container within the root used to group accounts; can be nested |
| **SCP** | Service Control Policy — a JSON policy that sets permission boundaries for accounts in an org |

## Monitoring

| Term | Definition |
|------|-----------|
| **Log Event** | A timestamp + message blob stored in CloudWatch Logs |
| **Log Stream** | An ordered sequence of log events from a single source |
| **Log Group** | A collection of log streams sharing retention and permission settings |
| **CloudTrail** | AWS service that logs every API call and account activity |
| **Management Event** | CloudTrail event for control-plane actions (create/delete resources) — enabled by default |
| **Data Event** | CloudTrail event for data-plane actions (S3 object reads/writes) — must be enabled, costs extra |
| **Control Tower** | AWS service that sets up and governs a secure, multi-account AWS environment (landing zone) |

## VPC

| Term | Definition |
|------|-----------|
| **VPC** | Virtual Private Cloud — a regionally isolated, regionally resilient private network inside AWS |
| **CIDR Block** | A range of IP addresses assigned to a VPC or subnet; VPCs range from /28 (16 IPs) to /16 (65,536 IPs) |
| **Subnet** | A subdivision of a VPC's IP space that lives in exactly one Availability Zone |
| **Route Table** | A set of rules (routes) that tells the VPC router where to send traffic leaving a subnet |
| **Internet Gateway (IGW)** | The region-resilient component that connects a VPC to the public internet; max one per VPC |
| **Bastion Host** | A hardened EC2 instance in a public subnet used as a controlled SSH/RDP entry point into private resources |
| **NACL** | Network Access Control List — a stateless, subnet-level firewall that can explicitly allow or deny traffic by IP/CIDR/port |
| **Security Group (SG)** | A stateful, ENI-level firewall that allows traffic; supports referencing other SGs and itself; no explicit deny |
| **NAT Gateway** | A managed AWS service that gives private instances outbound-only IPv4 internet access using a shared Elastic IP |
| **Elastic IP (EIP)** | A static public IPv4 address that can be associated with a resource and does not change on stop/start |
| **ENI** | Elastic Network Interface — a virtual NIC attached to an EC2 instance; Security Groups attach to ENIs |
| **DHCP Options Set** | Configuration passed to instances specifying DNS servers, domain names, etc.; immutable once created |
| **Ephemeral Port** | A short-lived port (1024–65535) chosen by the client OS for the response side of a TCP/UDP connection |
| **Stateless Firewall** | A firewall that evaluates each packet independently with no memory of prior packets (e.g. NACL) |
| **Stateful Firewall** | A firewall that tracks connections and automatically allows responses to permitted requests (e.g. Security Group) |

## Database Fundamentals

| Term | Definition |
|------|-----------|
| **Schema** | The fixed, pre-declared structure of a relational database — table names, attributes, types, and relationships |
| **Primary Key** | An attribute (or composite of attributes) that uniquely identifies every row in a table |
| **Composite Key** | A primary key formed from two or more attributes that, together, must be unique |
| **CAP Theorem** | A distributed database can guarantee at most two of: Consistency, Availability, Partition tolerance |
| **ACID** | Atomic, Consistent, Isolated, Durable — the transaction model used by most relational databases (RDS default) |
| **BASE** | Basically available, Soft state, Eventually consistent — the transaction model favoured by most NoSQL databases (DynamoDB default) |
| **OLTP** | Online Transaction Processing — row-based storage optimized for reading/writing whole records (e.g. RDS) |
| **OLAP** | Online Analytical Processing — column-based storage optimized for scanning one attribute across many rows (e.g. Redshift) |

## RDS

| Term | Definition |
|------|-----------|
| **DB Subnet Group** | A named list of VPC subnets (ideally spanning ≥2 AZs) that RDS is permitted to place instances into |
| **Multi-AZ Instance Deployment** | RDS HA mode with one primary and one unusable standby, synchronously replicated; failover ~60–120 sec |
| **Multi-AZ Cluster Deployment** | Newer RDS HA mode with one writer and two usable readers; faster (~35 sec) transaction-log-based failover |
| **Read Replica** | An asynchronously replicated, usable read-only copy of an RDS instance; up to 5 direct replicas, same-Region or cross-Region |
| **DB Snapshot** | A manually-triggered, incremental backup of an RDS instance that never expires until explicitly deleted |
| **Automated Backup** | Daily incremental backup plus 5-minute transaction logs, enabling point-in-time restore; retention 0–35 days |
| **TDE** | Transparent Data Encryption — engine-level encryption at rest, supported on Oracle and SQL Server |
| **RDS Proxy** | A managed database proxy that pools/multiplexes connections and abstracts failover from the application |
| **RDS Custom** | RDS variant (Oracle/SQL Server only) granting OS and engine access while retaining RDS-style automation |

## Aurora

| Term | Definition |
|------|-----------|
| **Aurora Cluster** | The base entity of Aurora: one primary (writer) plus zero or more usable read replicas, sharing one storage volume |
| **Cluster Volume** | Aurora's shared SSD storage, replicated across 6 storage nodes in 3 AZs, accessible to every instance in the cluster |
| **Backtrack** | Rolls an Aurora cluster back in place to a prior point in time, without creating a new cluster |
| **Fast Clone** | Creates a new Aurora database that references the source's storage, storing only the differences that accumulate afterward |
| **Aurora Serverless** | An on-demand Aurora configuration that scales compute (ACUs) automatically, down to zero when idle |
| **ACU** | Aurora Capacity Unit — a unit of compute + memory allocated from an AWS-managed warm pool in Aurora Serverless |
| **Aurora Global Database** | One primary Region plus up to 10 read-only secondary Regions, replicated at the storage layer in under a second |
| **Multi-Master Mode** | An Aurora mode where every instance in the cluster can read and write, using quorum-based write commits |

## Migration

| Term | Definition |
|------|-----------|
| **DMS** | Database Migration Service — a managed service that migrates databases via a replication instance running one or more tasks |
| **SCT** | Schema Conversion Tool — converts schemas/code between different database engines; only needed when the engine changes |
| **CDC** | Change Data Capture — replicating only the data changes made since a starting point, rather than a full data load |

## EFS

| Term | Definition |
|------|-----------|
| **EFS** | Elastic File System — AWS's managed NFSv4 shared file storage, mountable by multiple Linux instances at once |
| **Mount Target** | An ENI in a specific subnet that EC2 instances connect through to reach an EFS file system; one per AZ for HA |
| **Performance Mode** | EFS setting for latency vs throughput trade-off: General Purpose (default) or Max I/O |
| **Throughput Mode** | EFS setting for how bandwidth scales: Bursting (with file system size, default) or Provisioned (fixed, independent of size) |

## Backup

| Term | Definition |
|------|-----------|
| **AWS Backup** | A fully managed service that centralizes backup storage, scheduling, and retention across many AWS services, accounts, and Regions |
| **Backup Plan** | Defines backup frequency, window, lifecycle (cold storage/expiration), target vault, and cross-Region copy |
| **Backup Vault** | The storage destination for backups; read/write (deletable) by default |
| **Vault Lock** | Enables WORM mode on a vault after a 72-hour cool-off period; once active, nobody — including AWS — can delete its backups |
