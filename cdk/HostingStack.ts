import {
  App,
  CfnOutput,
  RemovalPolicy,
  aws_iam as IAM,
  aws_s3 as S3,
  Stack,
  Duration,
} from "aws-cdk-lib";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

export class HostingStack extends Stack {
  public constructor(
    parent: App,
    stackName: string,
    {
      repository: r,
      region,
      gitHubOIDCProviderArn,
    }: {
      repository: {
        owner: string;
        repo: string;
      };
      gitHubOIDCProviderArn: string;

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

    const gitHubOIDC = IAM.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
      this,
      "gitHubOICDProvider",
      gitHubOIDCProviderArn
    );
    const ghRole = new IAM.Role(this, "ghRole", {
      roleName: `${stackName}-cd`,
      assumedBy: new IAM.WebIdentityPrincipal(
        gitHubOIDC.openIdConnectProviderArn,
        {
          StringEquals: {
            [`token.actions.githubusercontent.com:sub`]: `repo:${r.owner}/${r.repo}:environment:production`,
            [`token.actions.githubusercontent.com:aud`]: "sts.amazonaws.com",
          },
        }
      ),
      description: `This role is used by GitHub Actions to deploy the website of ${stackName}`,
      maxSessionDuration: Duration.hours(1),
    });

    webBucket.grantReadWrite(ghRole);

    // Allow to describe this stack (to see outputs)
    ghRole.addToPolicy(
      new IAM.PolicyStatement({
        actions: ["cloudformation:DescribeStacks"],
        resources: [this.stackId],
      })
    );

    new CfnOutput(this, "gitHubCdRoleArn", {
      value: ghRole.roleArn,
      exportName: `${this.stackName}:gitHubCdRoleArn`,
    });
  }
}

export type StackOutputs = {
  gitHubCdRoleArn: string;
  bucketName: string;
};
