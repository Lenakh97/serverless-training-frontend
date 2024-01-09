import {
  App,
  CfnOutput,
  RemovalPolicy,
  aws_s3 as S3,
  Stack,
} from "aws-cdk-lib";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

export class HostingStack extends Stack {
  public constructor(
    parent: App,
    stackName: string,
    {
      repository: r,
      region,
      customDomain,
      gitHubOICDProviderArn,
    }: {
      repository: {
        owner: string;
        repo: string;
      };
      gitHubOICDProviderArn: string;
      customDomain?: {
        domainName: string;
        certificateId: string;
      };
      region: string;
    }
  ) {
    super(parent, stackName, {
      env: {
        region,
      },
    });

    // =====================================================================================
    // Website bucket
    // =====================================================================================
    const webBucket = new S3.Bucket(this, "cdk-rekn-publicbucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    new CfnOutput(this, "bucketURL", {
      value: webBucket.bucketWebsiteDomainName,
    });

    // =====================================================================================
    // Deploy site contents to S3 Bucket
    // =====================================================================================
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./public")],
      destinationBucket: webBucket,
    });
  }
}

export type StackOutputs = {
  gitHubCdRoleArn: string;
  distributionDomainName: string;
  bucketName: string;
  distributionId: string;
  mapName: string;
};
